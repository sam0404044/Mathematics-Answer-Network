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
          "question": "設數線上有一點 P 滿足 P 到 1 的距離加上 P 到 4 的距離等於 4。試問這樣的 P 有幾個？",
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
    answer_status: [[1], [2], [3], [4]],
    show_status: [false],
    time_spent: 629,
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
        if (!Array.isArray(await json.question_record)) {
          alert("找不到紀錄");
          window.location.href = "/";
          return;
        }
        let data = await json.question_record[0]
        let newState = { ...this.state }
        if (data.answer_review.has_review) {
          let question_fetch = await fetch("./api/getQuestion", {
            method: "POST",
            body: JSON.stringify({ question_id: data.answer_review.answer_info?.map(x => x.uid) }
            )
          })
            .then(res => res.json())

          newState.time_spent = data.answer_review.cost_time
          newState.questionbank.questions = question_fetch.questions
          newState.answer_status = data.answer_review.answer_info.map((x, index) => x.answer)
        } else {
          let question_fetch = await fetch("./api/getQuestion", {
            method: "POST",
            body: JSON.stringify({
              question_id: data.answer.answer_info?.map(x => x.uid)
            })
          })
            .then(res => res.json())
          newState.questionbank.questions = question_fetch.questions
          newState.answer_status = data.answer.answer_info.map((x, index) => x.answer)
          newState.time_spent = data.cost_time
        }
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
  solution_get = (id) => {
    console.log(`要求題目id: ${id} 的詳解`)
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
        <div className='scroll_area'>
          <button className='scroll_arrow' onClick={() => window.scrollTo(0, (this.state.scorll_switch ? 0 : document.body.scrollHeight))}>
            {(this.state.scorll_switch) ? "↑" : "↓"}
          </button>
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
                        <button className='solution_link' onClick={() => { this.solution_get(x.uid) }}>
                          詳細解答
                        </button>
                        <div>↓</div>
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
        <Footer />
      </div>
    );
  }
}

export default score;