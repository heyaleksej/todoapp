import React, {useEffect, useState} from 'react';
import styles from './Todolist.module.scss';
import {doc, deleteDoc, setDoc, updateDoc} from 'firebase/firestore';
import {db} from '../../bll/firebase';
import dayjs from 'dayjs';

//mui
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {Checkbox, TextField} from '@mui/material';
import CreateIcon from '@mui/icons-material/CreateTwoTone';
import DeleteIcon from '@mui/icons-material/DeleteTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {DatePicker} from "@mui/x-date-pickers";

/**
 * Компонент принимает объект с данными тудулиста
 * @param {Array} props
 * @returns отрисовывает отдельный тудулист или режим его редактирования в зависимости от значения editmode
 */
const Todolist = (props) => {

    const dateFormat = 'DD.MM.YYYY';
    const data = doc(db, 'todos', props.id)
    const isExpired = dayjs(props.deadline, dateFormat).isBefore(dayjs());

    //
    const [editMode, setEditMode] = useState(false);
    const [changes, setChanges] = useState({
        ...props, deadline: dayjs(props.deadline, dateFormat),
    });
    /**
     @method
     * подтягиваем акутальные данные из пропсов для отображения изменений в режиме редактирования
     */
    useEffect(() => {
        setChanges(props);
    }, [props])


    /**
     * универсальная функция изменяет состояния в useState для заголовка и описания
     * @param {object} event
     */
    const onChangeValue = (event) => {
        const {name, value} = event.target;
        setChanges({...changes, [name]: value});
    }

    /**
     * функция изменяет состояния в useState для дедлайна
     * @param {object} event
     */
    const onChangeDeadline = (event) => setChanges({...changes, deadline: event})

    /**
     * функция сохряняет изменения тудулиста в firebase
     */
    const saveChanges = async () => {
        const todoWithChanges = {...changes, deadline: changes.deadline.format(dateFormat)};
        await setDoc(data, todoWithChanges);
        setEditMode(!editMode);
    };

    /**
     * функция обновляет статус таски на сервере
     */
    const toggleComplete = async () => {
        await updateDoc(data, {
            done: !props.done,
        });
    };

    /**
     * функция для удаления таски
     */
    const deleteTodo = async () => {
        await deleteDoc(data);
    };


    let backgroundColor = props.done ? 'aquamarine' : isExpired ? '#F68585FF' : 'whitesmoke';


    return (
        <div className={styles.container}>
            {editMode ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className={styles.taskWrapper}>
                        <div className={styles.editModeWrapper}>
                            <TextField
                                sx={{display: 'block', marginBottom: '10px'}}
                                id='outlined-basic'
                                label='Change Task title...'
                                variant='outlined'
                                name='title'
                                value={changes.title}
                                onChange={onChangeValue}
                            />
                            <TextField
                                sx={{display: 'block', marginBottom: '10px'}}
                                className={styles.editDesc}
                                id='outlined-multiline-static'
                                label='Description...'
                                multiline
                                name='description'
                                value={changes.description}
                                onChange={onChangeValue}
                                rows={1}
                            />

                            <div className={styles.buttons}>
                                <DatePicker
                                    className={styles.input__date}
                                    label='Edit deadline...'
                                    ampm={false}
                                    inputFormat={dateFormat}
                                    value={changes.deadline}
                                    name='date'
                                    onChange={onChangeDeadline}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                <SaveIcon
                                    className={styles.save}
                                    color='success'
                                    onClick={saveChanges}
                                ></SaveIcon>
                                <CloseIcon
                                    className={styles.cancel}
                                    onClick={() => setEditMode(!editMode)}
                                ></CloseIcon>
                            </div>
                        </div>

                    </div>
                </LocalizationProvider>
            ) : (
                <div className={styles.taskWrapper} style={{background: backgroundColor}}>
                    <div className={styles.top}>
                        <h2 className={styles.title}>{props.title}</h2>
                        <div className={styles.description}>{props.description}</div>

                        {props.fileUrl && (
                            <img
                                className={styles.img}
                                onClick={() => window.open(props.fileUrl, '_blank')}
                                src={props.fileUrl}
                                alt='Your file'
                            />
                        )}
                    </div>
                    <div className={styles.buttonsWrapper}>
                        <span className={styles.checked}>
                           {props.done
                               ? <div> Выполнено </div>
                               : <div> Выполнить до {props.deadline}</div>
                           }
                            <Checkbox
                                checked={props.done}
                                fontSize='large'
                                onClick={toggleComplete}
                            ></Checkbox>
                        </span>

                        <span>
                            <CreateIcon
                                className={styles.edit}
                                onClick={() => setEditMode(!editMode)}
                            />
                            <DeleteIcon
                                className={styles.delete}
                                onClick={deleteTodo}
                            />
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Todolist;
