"use client"

import React, { Component } from 'react';
import "./style.css"
import Image from 'next/image'
import Link from 'next/link';
import Footer from '../components/Footer';
class score extends Component {
  state = {
    questionbank: {
      "exam_title": "114數B",
      "questions": [
        {
          "id": 1,
          "question": "設數線上有一點 P 滿足 P 到 1 的距離加上 P 到 4 的距離等於 4。試問這樣的 P 有幾個？",
          "options": [
            "0 個",
            "1 個",
            "2 個",
            "3 個",
            "無限多個"
          ],
          "answer": 2,
          "explanation": "設 P 的位置為 x，則 |x - 1| + |x - 4| = 4。解這個方程式可以得到 x = 1 或 x = 4，因此有 1 個解。",
          "image": ""
        }
      ]
    },
    answer_status: [1, 2, 3, 4],
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
  componentDidMount = () => {
    fetch("./json/question.json",)
      .then(data => {
        return data.json();
      }).then(data => {
        let newState = { ...this.state }
        newState.questionbank = data
        // 作答狀態假設↓↓↓↓↓↓↓↓↓↓
        newState.answer_status = data.questions.map((x, index) => (index % 5) + 1)
        // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        newState.status = data.questions.map(() => false)
        this.setState(newState);
      })

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
  showContent = (index) => {
    let newState = { ...this.state }
    newState.show_status[index] = this.state.show_status[index] ? false : true
    this.setState(newState);
  }

  calculateScore = () => {
    const correctN = this.state.questionbank.questions.filter((x, idx) => x.answer == this.state.answer_status[idx]).length
    // return Math.floor(correctN / this.state.questionbank.questions.length * 100)
    return 81
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
  render() {
    return (
      <React.Fragment>
        <div className='main'>
          <div className='score_display_area'>
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
                <span className='correct_answer_questions'>　你答對的題數：{this.state.questionbank.questions.filter((x, idx) => x.answer == this.state.answer_status[idx]).length}</span>
              </div>
            </div>
          </div>
          <div className='questions_area'>
            {this.state.questionbank.questions.map(
              (x, idx) => {
                return (
                  <div key={idx} className={"question_area " + (this.state.answer_status[idx] == x.answer ? " question_answer_correct " : " question_answer_wrong ") + (this.state.show_status[idx] ? " question_choosed " : " question_not_choosed ")}>
                    <div className={'question_topic ' + (this.state.show_status[idx] ? "topic_choosed" : "topic_not_choosed")} onClick={() => { this.showContent(idx) }}>
                      <span className={'question_topic_head ' + (this.state.show_status[idx] ? "question_topic_head_choosed" : "question_topic_head_not_choosed")}>
                        <Image
                          className='right_or_false_img'
                          src={this.state.answer_status[idx] == x.answer ? "./img/right.svg" : "./img/false.svg"}
                          width={20}
                          height={20}
                          alt='right or false'
                        />
                        <span className={"next_img_text " + (this.state.show_status[idx] ? " next_img_text_choosed " : " next_img_text_not_choosed ")}>{this.state.answer_status[idx] == x.answer ? "答對了" : " 答錯了"}</span>
                      </span>

                      <span className={'question_topic_text ' + (this.state.show_status[idx] ? "topic_text_choosed" : "topic_text_not_choosed")}>{idx + 1}. {x.question}</span>
                    </div>
                    <div className={'dropDown_content ' + (this.state.show_status[idx] ? "dropDown_content_visible" : "dropDown_content_disable")}>
                      <div className='answer_row right_answer'>正確答案:<br />{x.answer}</div>
                      <br />
                      <div className='answer_row your_answer'>你的答案:<br />{this.state.answer_status[idx]}</div>
                      <br /><br />
                      <div className='solution_area'>
                        <button className='solution_link' onClick={() => { this.solution_get(x.id) }}>
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
              <Link className='link_button' href="/">觀看成就</Link>
            </div>
            <div className='practice_link menu_area_link'>
              <Link className='link_button' href="/">錯題練習</Link>
            </div>
            <div className='main_page_link menu_area_link'>
              <Link className='link_button' href="/">回到首頁</Link>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default score;