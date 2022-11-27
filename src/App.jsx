import React, {useEffect, useState} from 'react';
import './App.scss';
import CreateTodo from './components/createTodoPage/CreateTodo';
import TodolistsPage from './components/todolistsPage/TodolistsPage';

//firebase
import {
    query, onSnapshot, collection,
    doc, orderBy
} from 'firebase/firestore';
import {db} from './bll/firebase';

const App = () => {

    const [todos, setTodos] = useState([])
    let data = collection(db, 'todos')

    /**
     * хук запрашивает все удаленные данные из Firebase.
     * @component
     */
    useEffect(() => {
        const q = query(data, orderBy('createdAt'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let todosArr = [];
            querySnapshot.forEach((doc) => {
                todosArr.unshift({...doc.data(), id: doc.id});
            });
            setTodos(todosArr);
        });
        return () => unsubscribe();
    }, [doc.data])

    return (
        <div>
            <h1 className="title"><span className='woman'>WomanUp</span> To Do List </h1>
            <div className="app">
                <div className='create-form'>
                    <CreateTodo/>
                </div>
                <div className='todo-wrapper'>
                    <TodolistsPage todos={todos}/>
                </div>
            </div>
        </div>
    );
}

export default App;
