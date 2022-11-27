import React from 'react';
import style from './TodolistsPage.module.scss';
import Todolist from "../todolist/Todolist";

/**
 * Компонент для отрисовки объектов из массива тудулистов
 * @returns Возвращает компонент с отдельным тудулистом
 */
const TodolistsPage = (props) => {

	return (
		<div className={style.todosWrapper}>
			{props.todos.map((todo, index) =>
				<Todolist key={index} {...todo}
			/>)}
		</div>
	);
};
export default TodolistsPage;
