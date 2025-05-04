"use client";

import React, { Component } from "react";
import "./style.css";
import Image from "next/image";
import Link from "next/link";

class quiz extends Component {
  state = {
    quiz: [
      {
        id: 1,
        question:
          "不透明袋中有藍、綠色球各若干顆，且球上皆有1或2的編號，其顆數如下表。例如標有1號的藍色球有2顆。\n\n|    | 藍 | 綠 |\n|----|----|----|\n| 1號 | 2  | 4  |\n| 2號 | 3  | k  |\n\n從此袋中隨機抽取一球（每顆球被抽到的機率相等），若已知抽到藍色球的事件與抽到1號球的事件互相獨立，試問k值為何？",
        options: ["2", "3", "4", "5", "6"],
        answer: "3",
        explanation:
          "要使抽到藍色球與抽到1號球的事件互相獨立，則P(藍色) × P(1號) = P(藍色且1號)。\n藍色球總數為2 + 3 = 5顆，綠色球總數為4 + k顆。\n總球數為5 + 4 + k = 9 + k。\nP(藍色) = 5/(9+k)，P(1號) = (2+4)/(9+k) = 6/(9+k)，\nP(藍色且1號) = 2/(9+k)。\n\n所以，5/(9+k) × 6/(9+k) = 2/(9+k)，\n30 = 2(9+k)，\n30 = 18 + 2k，\n12 = 2k，\nk = 6。\n\n因此，k的值為6。",
        image: "",
      },
      {
        id: 2,
        question:
          "不透明袋中有藍、綠色球各若干顆，且球上皆有1或2的編號，其顆數如下表。例如標有1號的藍色球有2顆。\n\n|    | 藍 | 綠 |\n|----|----|----|\n| 1號 | 2  | 4  |\n| 2號 | 3  | k  |\n\n從此袋中隨機抽取一球（每顆球被抽到的機率相等），若已知抽到藍色球的事件與抽到1號球的事件互相獨立，試問k值為何？",
        options: ["2", "3", "4", "5", "6"],
        answer: "3",
        explanation:
          "要使抽到藍色球與抽到1號球的事件互相獨立，則P(藍色) × P(1號) = P(藍色且1號)。\n藍色球總數為2 + 3 = 5顆，綠色球總數為4 + k顆。\n總球數為5 + 4 + k = 9 + k。\nP(藍色) = 5/(9+k)，P(1號) = (2+4)/(9+k) = 6/(9+k)，\nP(藍色且1號) = 2/(9+k)。\n\n所以，5/(9+k) × 6/(9+k) = 2/(9+k)，\n30 = 2(9+k)，\n30 = 18 + 2k，\n12 = 2k，\nk = 6。\n\n因此，k的值為6。",
        image: "",
      },
    ],
    index: 0,
    mytimeid: 0,
    time_count: 0,
    // 時間限制預設3600秒
    time_limit: 3600,
    start_time: new Date().toLocaleTimeString(Date.now()),
    timeCount_display: "00:00",
    status: [false],
    isLoading: true,
  };
  // 這裡fetch題庫資料跟開始計時
  componentDidMount = () => {
    this.state.timeCount_display = this.spend_time_toString(this.state.time_limit);
    fetch("./hsiao/json/question.json")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        let newState = { ...this.state };
        newState.quiz = data.questions;
        newState.status = data.questions.map(() => false);
        this.setState(newState);
              this.setMyInterval();
      });
  };

  setMyInterval = (event) => {
    if (this.state.mytimeid) {
      clearInterval(this.state.mytimeid);
    }
    this.state.mytimeid = setInterval(() => {
      this.state.time_count += 1;
      this.state.timeCount_display = this.spend_time_toString(this.state.time_limit - this.state.time_count);
      this.setState(this.state);
    }, 1000);
  };
  spend_time_toString = (time) => {
    let time_minutes = ("0" + Math.floor(time / 60)).substr(-2, 2);
    let time_seconds = ("0" + (time % 60)).substr(-2, 2);
    return `${time_minutes}:${time_seconds}`;
  };
  add = (event) => {
    if (this.state.index == this.state.quiz.length - 1) {
      console.log("now submit");

      return;
    }
    let newstate = { ...this.state };
    newstate.index += 1;
    this.setState(newstate);
  };
  sub = (event) => {
    if (this.state.index == 0) {
      console.log("already top");
      return;
    }
    let newstate = { ...this.state };
    newstate.index -= 1;
    this.setState(newstate);
  };
  choose = (index) => {
    let newstate = { ...this.state };
    newstate.status[this.state.index] = index;
    this.setState(newstate);
    console.log(newstate.status);
  };
  render() {
       return (
      <div className="main">
        <div className="title_area">
          <div className="title_word_area">
            <span className="title_word">Question {this.state.index}</span>
          </div>
          <div className="time_area">
            {/* 開始時間: */}
            {/* <h1>starttime: {this.state.start_time}</h1> */}
            <span className="time_count_text">{this.state.timeCount_display}</span>
          </div>
          <Link
            href={"/"}
            onNavigate={(event) => {
              if (confirm("確定要未交卷離開嗎?")) {
                clearInterval(this.state.mytimeid);
              } else {
                event.preventDefault();
              }
            }}
          >
            <Image src={"./hsiao/img/close.svg"} width={30} height={30} alt="this is close img" />
          </Link>
        </div>
        <div className="topic">
          <div className="topic_bar"></div>
          <div className="topic_word">{this.state.quiz[this.state.index].question}</div>
        </div>
        <div className="options_area">
          {this.state.quiz[this.state.index].options.map((x, idx) => (
            <div className="option_area" key={idx}>
              <button className="option" onClick={() => this.choose(idx)}>
                <div
                  className={
                    "option_letter " +
                    (this.state.status[this.state.index] === idx
                      ? " option_letter_choosed "
                      : " option_letter_not_choosed ")
                  }
                >
                  {idx + 1}
                </div>
                <div
                  className={
                    "option_word_area " +
                    (this.state.status[this.state.index] === idx
                      ? " option_word_area_choosed "
                      : " option_word_area_not_choosed ")
                  }
                >
                  <span className="option_word">{x}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
        <div className="source">
          <h3 className="source_text">Source: this is source</h3>
        </div>
        <div className="switch_button_area">
          <button
            className={"switch_button " + (this.state.index == 0 ? "edge" : "notInEdge")}
            disabled={this.state.index == 0}
            onClick={this.sub}
          >
            Previous
          </button>
          <button
            className={"switch_button " + (this.state.index == this.state.quiz.length - 1 ? "submit" : "notInEdge")}
            onClick={this.add}
          >
            {this.state.index + 1 == this.state.quiz.length ? "Submit" : "Next"}
          </button>
        </div>
        <div className="progress_bar">
          {this.state.status.map((x, idx) => (
            <div key={idx} className={x === false ? "progress_bar_not_selected" : "progress_bar_has_selected"}></div>
          ))}
        </div>
      </div>
    );
  }
}

export default quiz;
