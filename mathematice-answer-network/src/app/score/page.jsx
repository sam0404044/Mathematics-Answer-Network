"use client"

import React, { Component } from 'react';
import "./style.css"
import Image from 'next/image'
import Link from 'next/link';
import Footer from '../components/Footer';
import "../../lib/checkCookie"
import { loginOrNot } from '../../lib/checkCookie';
class score extends Component {
  state = {
    id: 1,
    scorll_switch: false,
    questionbank: {
      "questions": [
        {
          "localIndex": 1,
          "uid": 1,
          "question": "",
          "options": [
            "0 個",
            "1 個",
            "2 個",
            "3 個",
            "無限多個"
          ],
          "answer": [2],
          "explanation": "設 P 的位置為 x，則 |x - 1| + |x - 4| = 4。解這個方程式可以得到 x = 1 或 x = 4，因此有 1 個解。",
          "image": ""
        }
      ]
    },
    to_get_solution_status:false,
    menber_data: {plan_status:0,point:0},
    answer_status: [[1], [2], [3], [4]],
    show_status: [false],
    time_spent: 629,
    explanation: [],
    now_solution:{uid:0,index:0},
    star_setting: [
      {
        width: 67,
        height: 67,
        top: "5%",
        left: "80%",
        animation_delay: "0.1s"
      }, {
        width: 23,
        height: 23,
        top: "20%",
        left: "20%",
        animation_delay: "0.3s"
      }, {
        width: 51,
        height: 51,
        top: "50%",
        left: "5%",
        animation_delay: "0.7s"
      }, {
        width: 40,
        height: 40,
        top: "55%",
        left: "85%",
        animation_delay: "0.9s"
      }, {
        width: 42,
        height: 42,
        top: "75%",
        left: "25%",
        animation_delay: "0.5s"
      }, {
        width: 40,
        height: 40,
        top: "85%",
        left: "85%",
        animation_delay: "0s"
      },
    ]
  }
  componentDidMount = async () => {
    let jwt_uid = await loginOrNot()
    window.addEventListener("scroll", () => { this.scroll_event() })
    fetch("./api/score", {
      method: "POST",
      body: JSON.stringify({ uid: jwt_uid }
      )
    })
      .then(data => {
        return data.json();
      }).then(async (json) => {

        if (!Array.isArray(await json.question_record) ) {
          alert("找不到紀錄");
          window.location.href = "/";
          return;
        }
        let data = await json.question_record[0]
        let newState = { ...this.state }
        if(!data.score_now){
          window.location.href = "/";
        }
          let question_fetch = await fetch("./api/getQuestion", {
            method: "POST",
            body: JSON.stringify({ question_id: data.score_now.answer_info?.answer_info?.map(x => x.uid) }
            )
          })
            .then(res => res.json())
            
          newState.id =jwt_uid
          newState.time_spent = data.score_now.cost_time
          newState.questionbank.questions = question_fetch.questions
          newState.answer_status = data.score_now.answer_info.answer_info.map((x, index) => x.answer)
          newState.explanation = newState.answer_status.map(x => "")
       
        newState.questionbank.questions.forEach(x => {
          function translate_letter_to_number(letter) {
            if (Array.isArray(letter)) {
              return letter
            }
            switch (letter) {
              case "A":
              case "1":
              case 1:
                return [1];
              case "B":
              case "2":
              case 2:
                return [2];
              case "C":
              case "3":
              case 3:
                return [3];
              case "D":
              case "4":
              case 4:
                return [4];
              case "E":
              case "5":
              case 5:
                return [5];
              default:
                return [letter];

            }
          }
          x.answer = translate_letter_to_number(x.answer)
          x.options = [x.option_a, x.option_b, x.option_c, x.option_d, x.option_e]
        })
        console.log(newState)
        console.log(newState.answer_status)

        this.setState(newState);
        this.typesetMath()
      })

  }
  componentDidUpdate = () => {
    this.typesetMath(); // 每次更新後都重新渲染 MathJax
  }
  typesetMath = () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }
  chooseScoreBackgroundImg = () => {
    let getScore = this.calculateScore()
    if (getScore < 50) {
      return "./img/score_area_background_yellow.svg"
    } else if (50 <= getScore && getScore <= 80) {
      return "./img/score_area_background_green.svg"
    } else {
      return "./img/score_area_background_blue.svg"
    }
  }
  chooseScoreBackgroundColor = () => {
    let getScore = this.calculateScore()
    if (getScore < 50) {
      return "#D5981E"
    } else if (50 <= getScore && getScore <= 80) {
      return "#26A25F"
    } else {
      return "#0A7EDC"
    }
  }
  showContent = (index) => {
    let newState = { ...this.state }
    newState.show_status[index] = this.state.show_status[index] ? false : true
    this.setState(newState);
  }

  calculateScore = () => {

    if(this.state.id == 1){
      return "?"
    }
    const correctN = this.state.questionbank.questions.filter((x, idx) => (this.compare_answer(x.answer, this.state.answer_status[idx]))).length
    return Math.floor(correctN / this.state.questionbank.questions.length * 100)
    // return 80
    // return (分數)
  }
  spend_time_toString = (time) => {
    let time_minutes = ("0" + Math.floor(time / 60)).substr(-2, 2)
    let time_seconds = ("0" + time % 60).substr(-2, 2)
    return `${time_minutes}:${time_seconds}`
  }
  show_solution_menu = async(id,idx) =>{
    let newstate = {...this.state}
    const userdata = await fetch("./api/getUser", {
      method: "POST",
      body: JSON.stringify({ userid: this.state.id }
      )
    }).then(res =>res.json())
    newstate.now_solution = {uid:id,index:idx}
    newstate.menber_data = {plan_status:userdata.question_record[0].plan_status,point:userdata.question_record[0].points}
    newstate.to_get_solution_status = true
    this.setState(newstate)
  }
  not_show_solution_menu = () =>{
    let newstate = {...this.state}
    newstate.to_get_solution_status = false
    this.setState(newstate)
  }
  solution_get = async() => {

    let newstate = {...this.state}
    let data = await fetch("./api/getSolution", {
      method: "POST",
      body: JSON.stringify({ userid: this.state.id,questionId:this.state.now_solution.uid }
      )
    }).then(res =>res.json())
    if(data){
      newstate.explanation[this.state.now_solution.index] = data.status.solution[0].explanation
    }
    console.log(data.status.solution[0])
    newstate.to_get_solution_status = false
    this.setState(newstate)
  }
  star_display = () => {
    return (
      this.state.star_setting.map(
        (star, idx) => {
          return (
            <Image
              className='star_img'
              key={idx}
              src={"./img/star.svg"}
              width={star.width}
              height={star.height}
              style={{ left: star.left, top: star.top, animationDelay: star.animation_delay }}

            />

          )
        }
      )
    )
  }
  question_sort_start_wrong_to_correct = () => {
    let newquestions = [...this.state.questionbank.questions]
    newquestions.forEach((x, idx) => x.localIndex = idx)
    let wrong_question = newquestions.filter((x, idx) => !(this.compare_answer(x.answer, this.state.answer_status[idx])))
    let correct_question = newquestions.filter((x, idx) => (this.compare_answer(x.answer, this.state.answer_status[idx])))
    return [...wrong_question, ...correct_question]
  }

  compare_answer = (array1, array2) => {
    return array1?.sort().toString() === array2?.sort().toString()
  }
  scroll_event = () => {
    let newstate = { ...this.state }

    if (window.pageYOffset < (document.body.scrollHeight / 2)) {
      newstate.scorll_switch = false
    } else {
      newstate.scorll_switch = true
    }
    this.setState(newstate)
  }
  display_option = (qidx, opidx) => {
    console.log()
    return (
      this.state.questionbank.questions[qidx].options[opidx - 1]
    )
  }
  render() {
    return (
      <div className='page_container'>
        <div className='bg-[url(/img/choseTestBackGround.png)]'>
        <div className='scroll_area'>
          <button className='scroll_arrow' onClick={() => window.scrollTo(0, (this.state.scorll_switch ? 0 : document.body.scrollHeight))}>
            {(this.state.scorll_switch) ? "↑" : "↓"}
          </button>
        </div>
        <div
            className={
              "solution_menu " +
              (this.state.to_get_solution_status
                ? "solution_menu_open"
                : "solution_menu_close")
            }
          >
            <div className="solution_menu_window">
              <div className="solution_menu_bar"></div>
              <div className="solution_menu_paragraph">
                {"確定要花費1點看詳解嗎"}<br/>
                {` 方案: ${this.state.menber_data.plan_status} 點數:  ${this.state.menber_data.point}`}
              </div>
              <div className="solution_menu_button_area">
                <button className="solution_menu_button" onClick={() => {this.solution_get()}}>
                  {"確定"}
                </button>
                <button
                  className="solution_menu_button"
                  onClick={() => {this.not_show_solution_menu()}}
                >
                  {"取消"}
                </button>
              </div>
            </div>
          </div>
        <div className='main'>
          <div className='score_display_area' style={{ backgroundColor: this.chooseScoreBackgroundColor() }}>
            <Image
              className='score_display_img'
              src={this.chooseScoreBackgroundImg()}
              width={412}
              height={412}
              alt='this is background'
              priority={true}
            />
            <div className='star_display_area'>
              {(this.calculateScore() > 80) ? this.star_display() : ""}
            </div>

            <div className='score_display_text'>
              <div className='scoreYouGet_text'>你的得分</div>
              <div className='score_get'>
                <span className='your_score'>{this.calculateScore()}</span>
                <span className='total_score'>/100</span>
              </div>
              <div className='answer_status'>
                <span className='total_questions'>總答題數：{this.state.questionbank.questions.length}</span>
                <span className='correct_answer_questions'>　你答對的題數：{this.state.questionbank.questions.filter((x, idx) => this.compare_answer(x.answer, this.state.answer_status[idx])).length}</span>
              </div>
            </div>
          </div>
          <div className='questions_area'>
            {this.question_sort_start_wrong_to_correct().map(
              (x, idx) => {
                return (
                  <div key={idx} className={"question_area " + (this.state.answer_status[x.localIndex] == x.answer ? " question_answer_correct " : " question_answer_wrong ") + (this.state.show_status[idx] ? " question_choosed " : " question_not_choosed ")}>
                    <div className={'question_topic ' + (this.state.show_status[idx] ? "topic_choosed" : "topic_not_choosed")} onClick={() => { this.showContent(idx) }}>
                      <span className={'question_topic_head ' + (this.state.show_status[idx] ? "question_topic_head_choosed" : "question_topic_head_not_choosed")}>
                        <Image
                          className='right_or_false_img'
                          src={this.compare_answer(this.state.answer_status[x.localIndex], x.answer) ? "./img/right.svg" : "./img/false.svg"}
                          width={20}
                          height={20}
                          alt='right or false'
                        />
                        <span className={"next_img_text " + (this.state.show_status[idx] ? " next_img_text_choosed " : " next_img_text_not_choosed ")}>{(this.compare_answer(this.state.answer_status[x.localIndex], x.answer)) ? "答對了" : " 答錯了"}</span>
                      </span>

                      <span className={'question_topic_text ' + (this.state.show_status[idx] ? "topic_text_choosed" : "topic_text_not_choosed")}>{x.localIndex + 1}. {x.question}</span>
                    </div>
                    <div className={'dropDown_content ' + (this.state.show_status[idx] ? "dropDown_content_visible" : "dropDown_content_disable")}>
                      <div className='answer_row right_answer'>正確答案:<br />{x.answer.map(y => <div>{`(${y}) ` + this.display_option(x.localIndex, y)} <br /></div>)}</div>
                      <br />
                      <div className='answer_row your_answer'>你的答案:<br />{this.state.answer_status[x.localIndex].length == 0 ? "未作答" : this.state.answer_status[x.localIndex].map(y => <div> {`(${y}) ` + this.display_option(x.localIndex, y)}<br /></div>)}</div>
                      <br /><br />
                      <div className='solution_area'>
                        <button disabled={this.state.explanation[idx] ? true: false} className='solution_link' onClick={() => { this.show_solution_menu(x.uid,idx)}}>
                          詳細解答
                        </button>
                        <div>↓</div><br />
                        <div>{this.state.explanation[idx]}</div>
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
          <div className='menu_area'>
            <div className='time_area'>
              <span>答題時間</span>
              <span>{this.spend_time_toString(this.state.time_spent)}</span>
            </div>
            <div className='achievement_link menu_area_link'>
              <Link className='link_button' href="/record">觀看成就</Link>
            </div>
            <div style={this.calculateScore() == 100 ? { display: "none" } : {}} className='practice_link menu_area_link'>
              <Link className='link_button' href="/quiz/review">錯題練習</Link>
            </div>
            <div className='main_page_link menu_area_link'>
              <Link className='link_button' href="/">回到首頁</Link>
            </div>

          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default score;