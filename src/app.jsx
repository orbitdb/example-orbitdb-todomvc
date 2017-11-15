/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(async function () {
	'use strict';

	// Name of the database
	var namespace = 'react-todos'

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handleNewTodoKeyDown: async function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				await this.props.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		},

		toggleAll: async function (event) {
			var checked = event.target.checked;
			await this.props.model.toggleAll(checked);
		},

		toggle: async function (todoToToggle) {
			await this.props.model.toggle(todoToToggle);
		},

		destroy: async function (todo) {
			await this.props.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
		},

		save: async function (todoToSave, text) {
			await this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (todos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul className="todo-list" key="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			const loadPercentage = Math.round(this.props.model.status.loaded  / this.props.model.status.total * 100)

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						{!this.props.model.ready 
							? <p className="loadingText">
									{this.props.model.ready 
										? null 
										: 'Loading... ' + loadPercentage + '%'
									}
								</p> 
							: null
						}
						{this.props.model.ready
							? <input
									className="new-todo"
									placeholder="What needs to be done?"
									value={this.state.newTodo}
									onKeyDown={this.handleNewTodoKeyDown}
									onChange={this.handleChange}
									autoFocus={true}
								/>
							: null
						}
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	// Create the store (storage backend)
	var db = await store(namespace);

	// Create the data model
	var model = new app.TodoModel(db, namespace);

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	// Render the app
	model.subscribe(render);
	render();

  // Load the database from locally persisted data
  await db.load()
})();
