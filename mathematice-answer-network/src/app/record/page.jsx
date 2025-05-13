'use client'

import React, { Component } from 'react';
import "./style.css"
import Image from 'next/image'
import Footer from '../components/Footer';
import NavBar from "../components/NavBar";
import Link from 'next/link';
import "../../lib/checkCookie"
import { loginOrNot } from '../../lib/checkCookie';
class record extends Component {
    state = {
        id: 1,
        tree: {
            tree_status: 4,
            tree_grow_up_gap: 5,
        },
        wrong_question: {
            total_number: 15
        },
        answer_history: [
            {
                date: { month: 3, day: 22, time: { hours: 12, minutes: 34, seconds: 56 } },
                answer_record: { has_answer: 20, total_question: 25 },
                question_bank: "隨機選題"
            },
            {
                date: { month: 3, day: 21, time: { hours: 12, minutes: 34, seconds: 56 } },
                answer_record: { has_answer: 15, total_question: 30 },
                question_bank: "隨機選題"
            },
            {
                date: { month: 3, day: 19, time: { hours: 12, minutes: 34, seconds: 56 } },
                answer_record: { has_answer: 10, total_question: 10 },
                question_bank: "隨機選題"
            },
            {
                date: { month: 2, day: 9, time: { hours: 12, minutes: 34, seconds: 56 } },
                answer_record: { has_answer: 5, total_question: 45 },
                question_bank: "隨機選題"
            },
            {
                date: { month: 1, day: 10, time: { hours: 12, minutes: 34, seconds: 56 } },
                answer_record: { has_answer: 0, total_question: 5 },
                question_bank: "隨機選題"
            },
        ]



    }
    componentDidMount = async() => {
        let jwt_uid = await loginOrNot()
        fetch("./api/record", {
            method: "POST",
            body: JSON.stringify({ uid: jwt_uid }
            )
        })
            .then(res => res.json())
            .then(async json => {
                json = await json
                console.log(json)
                let newstate = { ...this.state }
                newstate.answer_history = json.question_record.map(question => {
                    let timestamp = new Date(question.time).getTime()

                    return (
                        {
                            date: { month: (new Date(timestamp).getMonth()) + 1, day: new Date(timestamp).getDate(), time: { hours: new Date(timestamp).getHours(), minutes: new Date(timestamp).getMinutes(), seconds: new Date(timestamp).getSeconds() } },
                            answer_record: { has_answer: question.answer.answer_status.correct, total_question: question.answer.answer_status.total },
                            question_bank: question.question_bank
                        }
                    )
                })
                newstate.tree = {
                    tree_status: json.tree_status[0].status,
                    tree_grow_up_gap: json.tree_status[0].gap
                }
                
                try {
                    newstate.wrong_question.total_number = json.wrong_question_n[0]?.wrong_question_number
                } catch (error) {
                    alert("找不到紀錄");
                    window.location.href = "/";
                    return;
                }
                
                this.setState(newstate)
            })
    }
    tree_status = () => {
        let tree_address
        switch (this.state.tree.tree_status) {
            case 1:
                tree_address = "./img/tree_1.svg"
                break;
            case 2:
                tree_address = "./img/tree_2.svg"
                break;
            case 3:
                tree_address = "./img/tree_3.svg"
                break;
            case 4:
                tree_address = "./img/tree_4.svg"
                break;
            default:
                tree_address = "./img/tree_1.svg"
                break;

        }
        return tree_address
    }
    render() {
        return (
            <div className='page_container'>
                <NavBar />
                <div className='main'>
                    <div className='title_area'>
                        <span className='title_text'>
                            個人紀錄與學習建議
                        </span>
                    </div>
                    <div className='area_default tree_area'>
                        <div className='tree_status_text_area'>
                            <span className='tree_status_text'>
                                再答題 {this.state.tree.tree_grow_up_gap} 次後成長
                            </span>
                        </div>
                        <div className='tree_status_img_area'>
                            <Image
                                className='tree_status_tree'
                                src={this.tree_status()}
                                width={285}
                                height={285}
                                alt='tree'
                            />
                            <Image
                                className='tree_status_flower_pot'
                                src={"./img/flower_pot.svg"}
                                width={240}
                                height={240}
                                alt='flower_pot'
                            />
                        </div>
                    </div>
                    <div className='area_default wrong_answer_record_area'>
                        <div className='wrong_answer_record_title'>
                            <span className='text_display_wrong_question_collection'>顯示錯題集</span>
                        </div>
                        <div className='wrong_question_collection_area'>
                            <div className='text_wrong_question_collection'>
                                <span>累積錯題</span>
                            </div>
                            <div className='wrong_question_collection_number'>
                                <span>{this.state.wrong_question.total_number ? this.state.wrong_question.total_number : 0}</span>
                            </div>
                        </div>
                        <Link href='/' className='improve_button'>
                            <span className='improve_button_text'>針對題目進行加強</span>
                        </Link>
                    </div>
                    <div className='area_default answer_history_area'>
                        <div className='answer_history_title'>
                            <span className='answer_history_area_title_text'>
                                觀察歷史答題記錄
                            </span>
                        </div>
                        <div className='answer_history_content'>
                            {this.state.answer_history.map((x, idx) => {
                                return (
                                    <div className={'answer_history_content_record ' + (idx == this.state.answer_history.length - 1 ? 'record_last' : 'record_not_last')} key={idx}>
                                        <div className='record_date'>
                                            <span className='record_date_text'>
                                                {x.date.month}月 {x.date.day}日 {x.date.time.hours}點 {x.date.time.minutes}分 {x.date.time.seconds}秒
                                            </span>
                                        </div>
                                        <div className='record_answer_status'>
                                            <span className='record_answer_status_text'>
                                                範圍: {x.question_bank}
                                            </span>
                                            <span className='record_answer_status_text'>
                                                答題: {x.answer_record.has_answer} / {x.answer_record.total_question}
                                            </span>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default record;