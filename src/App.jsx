import React, {useEffect, useState} from 'react';
import './App.scss';
import CreateTodo from './components/createTodoPage/CreateTodo';
import TodolistsPage from './components/todolistsPage/TodolistsPage';
import {
    query, onSnapshot, collection, getDocs, updateDoc,
    doc,
    addDoc,
    deleteDoc, orderBy
} from 'firebase/firestore';
import {db} from './bll/firebase';
import {getData} from './bll/todo-reducers';
import {useDispatch} from 'react-redux';
import Todo from "./components/createTodoPage/Todo";
import dayjs from "dayjs";

const App = () => {

    const [todos, setTodos] = useState([])
    const [input, setInput] = useState('');
    let data = collection(db, 'todos')


    /**
     * При вызове этой функции запрашиваются все данный из FireBase.
     * После добавляются с помощью специальных функции из React-bll, Добавляется в State List
     * @component
     * Функция ничего не возвращает и не принимает
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

    // Create todo
    const createTodo = async (e) => {
        e.preventDefault(e);
        if (input === '') {
            alert('Please enter a valid todo');
            return;
        }
        await addDoc(data, {
            title: input,
            createdAt: dayjs(new Date()).format('DD.MM.YY hh:mm ss'),
            deadline: dayjs().format('DD.MM.YY hh:mm'),
            done: false,
        });
        setInput('');
    };

    // Update todo in firebase
    const toggleComplete = async (todo) => {
        await updateDoc(doc(db, 'todos', todo.id), {
            done: !todo.done,
        });
    };

    // Delete todo
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, 'todos', id));
    };


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
                <form onSubmit={createTodo}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        placeholder='Add Todo'
                    />
                    <button>
                        +
                    </button>
                </form>
                <ul>
                    {todos.map((todo, index) => (
                        <Todo
                            key={index}
                            todo={todo}
                            toggleComplete={toggleComplete}
                            deleteTodo={deleteTodo}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
