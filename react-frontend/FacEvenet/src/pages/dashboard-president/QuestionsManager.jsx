import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { get_unanswered_questions,answer_question } from '../../services/eventServices';
import { Toast } from 'primereact/toast';
import './QuestionsManager.css';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';


export const QuestionsManager = () => {
    const [questions, setQuestions] = useState([]);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [value, setValue] = useState('');
    useEffect(() => {
        get_unanswered_questions().then((res) => {
            if (res.error) {
                console.log(res.error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: res.error.message });
            }
            else {
                console.log(res);

                setQuestions(res);
            }
        });
    }, []);

    const handleAnswer = (id,value) => () => {
        answer_question(id,value).then((res) => {
            if (res.error) {
            }
            else {
                setQuestions(questions.filter((question) => question.id !== id));
            }
        });
    }

    return (
        <div className="container">
            <Toast ref={toast} />
            {questions?.length}
            <div className="questions-manager-content">
                {questions?.length === 0 ? <h2>No unanswered questions</h2> :
                    <div className="Unanswered-questions">
                        <div className="title">
                            <h2>Unanswered Questions</h2>
                        </div>
                        <table>
                            <tr>
                                <th>Author</th>

                                <th>Question</th>
                                <th>Event</th>
                                <th>Actions</th>
                            </tr>
                            {questions?.map((question) => (
                                <tr key={question.id}>
                                    <td>
                                        {question.author.first_name} {question.author.last_name}
                                    </td>
                                    <td>{question.question}</td>
                                    <td>
                                        {question.event.name}
                                    </td>
                                    <td>
                                        <Button
                                            label="Answer"
                                            onClick={() => { setSelectedQuestion(question); setVisible(true) }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>}
            </div>
            <Dialog header="Answer" visible={visible} onHide={() => setVisible(false)} footer={
                <div>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
                    <Button label="Answer" icon="pi pi-check" onClick={handleAnswer(selectedQuestion?.id,value)} autoFocus />
                </div>
            
            }>
                <FloatLabel>
                    <InputText id="answer" value={value} onChange={(e) => setValue(e.target.value)} />
                    <label htmlFor="answer">Answer</label>
                </FloatLabel>
            </Dialog>
        </div>
    );
};