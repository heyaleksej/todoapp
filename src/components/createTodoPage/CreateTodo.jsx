import React, {useState} from 'react';
import style from './CreateTodo.module.scss';
import {v4} from "uuid";

//mui
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {TextField} from '@mui/material';
import Button from '@mui/material/Button';
import {DatePicker} from "@mui/x-date-pickers";

//firebase
import {db, storage} from '../../bll/firebase';
import {collection, addDoc} from 'firebase/firestore';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';


/**
 * React компонент Panel собирает и отправляет данные в FireBase и Redux
 * @returns Возвращает HTML разметку для ввода информации
 */
const CreateTodo = () => {
    let data = collection(db, 'todos')
   //state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(dayjs().format('YYYY-MM-DD'));
    const [file, setFile] = useState(null);

    /**
     *функция следит за прикрепленным файлом и сохраняет его в useState
     */
    const onFileChange = (e) => setFile(e.target.files[0]);

    /** Функция добавляет таск в FireBase.
     * идёт проверка наличия прикрепленного файла. Если файл есть, идет загрузке файла в Firestore
     * если файла нет, тогда сразу добавляет таск в firebase.
     */
    const addTodo = async (e) => {
        e.preventDefault(e);
        if (title === '') {
            alert('Please enter a valid todo');
            return;
        }
        if (file) {
            const fileName = `${file.name + v4()}`
            const fileRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(fileRef, file);
            await uploadTask
                .then(() => {
                    return getDownloadURL(uploadTask.snapshot.ref);
                })
                .then((url) => {
                    return addDoc(data, {
                        title: title,
                        createdAt: dayjs().format('DD.MM.YY H:mm ss'),
                        description: description,
                        deadline: dayjs(deadline).format('DD-MM-YYYY'),
                        done: false,
                        fileUrl: url
                    })
                }).then(() => {
                        setDescription('')
                        setTitle('')

                    }
                )
        } else {
            await addDoc(data, {
                title: title,
                createdAt: dayjs().format('DD.MM.YY H:mm ss'),
                description: description,
                deadline: dayjs(deadline).format('DD-MM-YYYY'),
                done: false,
            })
            setTitle('')
            setDescription('')
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={style.container}>
                <TextField
                    className={style.title}
                    id='outlined-basic'
                    name='title'
                    label='Enter task title...'
                    variant='outlined'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <DatePicker
                    className={style.date}
                    label='Deadline'
                    ampm={false}
                    inputFormat={'DD-MM-YYYY'}
                    value={deadline}
                    onChange={(e) => setDeadline(e)}
                    renderInput={(params) => <TextField {...params} />}
                />

                <TextField
                    name='description'
                    value={description}
                    className={style.text}
                    id='outlined-multiline-static'
                    label='Description...'
                    multiline
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input className={style.file} type={'file'} onChange={onFileChange}/>
                <Button
                    style={{display: 'flex', margin: 'auto'}}
                    variant='contained'
                    disabled={!title}
                    onClick={addTodo}
                >
                    Add Todolist
                </Button>
            </div>
        </LocalizationProvider>
    );
};
export default CreateTodo;
