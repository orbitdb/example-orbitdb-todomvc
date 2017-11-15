/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (db, key) {
		this.db = db;
		this.key = key;
		this.todos = [];
		this.onChanges = [];
		this.ready = false
		this.status = {
			loaded: 0,
			total: 0,
		}
		// When the database was loaded and is ready to use, 
		// refresh our data model and set the state to ready
		this.db.events.on('ready', () => {
			this.ready = true
			this.inform()
		})
		// When a remote peer updated the todos, refresh our data model
		this.db.events.on('replicated', () => this.inform())
		// Watch for load progress and update the model state with the progress
		this.db.events.on('load.progress', (address, hash, entry, progress, total) => {
			this.status.loaded = progress
			this.status.total = total
			this.onChanges.forEach(function (cb) { cb(); });
		})
	};

	app.TodoModel.prototype.load = async function () {
		await this.inform();
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = async function () {
		this.todos = await Utils.store(this.db, this.key);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = async function (title) {
		const newTodo = {
			id: Utils.uuid(),
			title: title,
			completed: false
		}
		await Utils.store(this.db, this.key, newTodo);
		this.inform();
	};

	app.TodoModel.prototype.toggleAll = async function (checked) {
		for (let todo of this.todos) {
			const updatedTodo = Utils.extend({}, todo, {completed: checked});
			await Utils.store(this.db, this.key, updatedTodo);
		}
		this.inform();
	};

	app.TodoModel.prototype.toggle = async function (todoToToggle) {
		const updatedTodo = Utils.extend({}, todoToToggle, {completed: !todoToToggle.completed});
		await Utils.store(this.db, this.key, updatedTodo);
		this.inform();
	};

	app.TodoModel.prototype.destroy = async function (todo) {
		await Utils.store(this.db, this.key, null, todo);
		this.inform();
	};

	app.TodoModel.prototype.save = async function (todoToSave, text) {
		const updatedTodo = Utils.extend({}, todoToSave, {title: text});
		await Utils.store(this.db, this.key, updatedTodo);
		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

})();
