var app = app || {};

(function () {
	'use strict';

	app.Utils = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
					.toString(16);
			}

			return uuid;
		},

		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},

		store: async function (db, namespace, todo, removeTodo) {
			if (todo && !removeTodo) {
				await db.put({ _id: todo.id, todo: todo })
			} else if (!todo && removeTodo) {
				await db.del(removeTodo.id)
			}

			var todos = db.query(e => true, { fullOp: true })
				.sort((a, b) => {
					// Sort by the time of first revision,
					// ie. order the entries by their first appearance
					const aMin = Array.from(a._revs).reduce((res, e) => res = Math.min(e.clock.time, res), a.clock.time)
					const bMin = Array.from(b._revs).reduce((res, e) => res = Math.min(e.clock.time, res), b.clock.time)
					const dist = bMin - aMin
					// If updates were concurrent, sort by user id
					return dist !== 0 ? dist : a.clock.id > b.clock.id ? -1 : 1
				})
				.map(e => e.payload.value.todo)

			return Promise.resolve(todos || []);
		},

		extend: function () {
			var newObj = {};
			for (var i = 0; i < arguments.length; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
			}
			return newObj;
		}
	};
})();
