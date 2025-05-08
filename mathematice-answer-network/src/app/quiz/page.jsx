"use client";
import { unstable_ViewTransition as ViewTransition } from "react";
import React, { Component } from "react";
import "./style.css";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import { view } from "framer-motion/client";
class quiz extends Component {
  state = {
    quiz: [
      {
        id: 1,
        question:
          "設數線上有一點 P 滿足 P 到 1 的距離加上 P 到 4 的距離等於 4。試問這樣的 P 有幾個？",
        options: ["0 個", "1 個", "2 個", "3 個", "無限多個"],
        answer: [2, 3],
        explanation:
          "設 P 的位置為 x，則 |x - 1| + |x - 4| = 4。解這個方程式可以得到 x = 1 或 x = 4，因此有 1 個解。",
        question_type: "mutiple",
      },
      {
        id: 2,
        question:
          "不透明袋中有藍、綠色球各若干顆，且球上皆有1或2的編號，其顆數如下表。例如標有1號的藍色球有2顆。\n\n|    | 藍 | 綠 |\n|----|----|----|\n| 1號 | 2  | 4  |\n| 2號 | 3  | k  |\n\n從此袋中隨機抽取一球（每顆球被抽到的機率相等），若已知抽到藍色球的事件與抽到1號球的事件互相獨立，試問k值為何？",
        options: ["2", "3", "4", "5", "6"],
        answer: "3",
        explanation:
          "要使抽到藍色球與抽到1號球的事件互相獨立，則P(藍色) × P(1號) = P(藍色且1號)。\n藍色球總數為2 + 3 = 5顆，綠色球總數為4 + k顆。\n總球數為5 + 4 + k = 9 + k。\nP(藍色) = 5/(9+k)，P(1號) = (2+4)/(9+k) = 6/(9+k)，\nP(藍色且1號) = 2/(9+k)。\n\n所以，5/(9+k) × 6/(9+k) = 2/(9+k)，\n30 = 2(9+k)，\n30 = 18 + 2k，\n12 = 2k，\nk = 6。\n\n因此，k的值為6。",
        question_type: "single",
      },
    ],
    index: 0,
    mytimeid: 0,
    time_count: 0,
    // 時間限制預設3600秒
    time_limit: 3600,
    start_time: new Date().toLocaleTimeString(Date.now()),
    timeCount_display: "00:00",
    status: [[], []],
    viewed_question: [0],
    question_menu_status: false,
    exit_menu_status: false,
    commit_status: false,
    dark_mode: false,
  };
  // 這裡fetch題庫資料跟開始計時
  componentDidMount = () => {
    const searchParam = new URLSearchParams(window.location.search);
    const uid = searchParam.get("uid");
    console.log(uid);

    this.state.timeCount_display = this.spend_time_toString(
      this.state.time_limit
    );
    fetch("./json/question.json")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        let newState = { ...this.state };
        newState.quiz = data.questions;
        newState.status = data.questions.map(() => []);
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
      if (this.state.time_count > this.state.time_limit) {
        alert("時間到");
      }
      this.state.timeCount_display = this.spend_time_toString(
        this.state.time_limit - this.state.time_count
      );
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
      this.commit_quiz_or_not();
      return;
    }
    let newstate = { ...this.state };
    newstate.index += 1;
    if (!newstate.viewed_question.includes(newstate.index)) {
      newstate.viewed_question.push(newstate.index);
    }
    this.setState(newstate);
  };
  sub = (event) => {
    if (this.state.index == 0) {
      console.log("already top");
      return;
    }
    let newstate = { ...this.state };
    newstate.index -= 1;
    if (!newstate.viewed_question.includes(newstate.index)) {
      newstate.viewed_question.push(newstate.index);
    }
    this.setState(newstate);
  };
  choose_single = (index) => {
    let newstate = { ...this.state };
    newstate.status[this.state.index] = [index];
    this.setState(newstate);
    console.log(newstate.status);
  };
  choose_mutiple = (index) => {
    let newstate = { ...this.state };

    if (newstate.status[this.state.index].length === 0) {
      newstate.status[this.state.index] = [index];
    } else {
      if (newstate.status[this.state.index].includes(index)) {
        newstate.status[this.state.index].splice(
          newstate.status[this.state.index].indexOf(index),
          1
        );
      } else {
        newstate.status[this.state.index].push(index);
      }
    }
    this.setState(newstate);
    console.log(newstate.status);
  };
  question_type_depend = (index) => {
    switch (this.state.quiz[this.state.index].question_type) {
      case "single":
        this.choose_single(index);
        break;
      case "mutiple":
        this.choose_mutiple(index);
        break;
      default:
        this.choose_single(index);
        break;
    }
  };
  jump_to_question_and_close_tab = (index) => {
    let newstate = { ...this.state };
    newstate.index = index;
    newstate.question_menu_status = newstate.question_menu_status
      ? false
      : true;
    if (!newstate.viewed_question.includes(index)) {
      newstate.viewed_question.push(index);
    }
    this.setState(newstate);
  };
  switch_question_menu_status = () => {
    let newstate = { ...this.state };
    newstate.question_menu_status = newstate.question_menu_status
      ? false
      : true;
    this.setState(newstate);
  };
  show_leave_menu_or_not = () => {
    let newstate = { ...this.state };
    newstate.exit_menu_status = newstate.exit_menu_status ? false : true;
    this.setState(newstate);
    console.log(newstate.exit_menu_status);
  };
  commit_quiz_or_not = () => {
    let newstate = { ...this.state };
    newstate.commit_status = newstate.commit_status ? false : true;
    newstate.exit_menu_status = newstate.exit_menu_status ? false : true;
    this.setState(newstate);
  };
  dark_mode_switch = () => {
    let newstate = { ...this.state };
    newstate.dark_mode = newstate.dark_mode ? false : true;
    this.setState(newstate);
  };

  render() {
    return (
      <div className="page_container">
        <div
          className={
            " main " +
            (this.state.dark_mode
              ? " main_dark_mode_on "
              : " main_dark_mode_off ")
          }
        >
          <div
            className={
              "leave_menu " +
              (this.state.exit_menu_status
                ? "leave_menu_open"
                : "leave_menu_close")
            }
          >
            <div className="leave_menu_window">
              <div className="leave_menu_bar"></div>
              <div className="leave_menu_paragraph">
                {this.state.commit_status
                  ? "確定要交卷嗎?"
                  : "確定要未交卷離開嗎?"}
              </div>
              <div className="leave_menu_button_area">
                <button className="leave_menu_button">
                  {
                    <Link href={this.state.commit_status ? "/score" : "/"}>
                      {this.state.commit_status ? "確定交卷" : "確定離開"}
                    </Link>
                  }
                </button>
                <button
                  className="leave_menu_button"
                  onClick={
                    this.state.commit_status
                      ? () => this.commit_quiz_or_not()
                      : () => this.show_leave_menu_or_not()
                  }
                >
                  {"取消"}
                </button>
              </div>
            </div>
          </div>
          <div
            className={
              "question_overlay_menu " +
              (this.state.question_menu_status
                ? " question_overlay_menu_open "
                : " question_overlay_menu_close ")
            }
          >
            <div
              className={
                "question_overlay_menu_content " +
                (this.state.question_menu_status
                  ? " question_overlay_menu_content_open "
                  : " question_overlay_menu_content_close ")
              }
            >
              {this.state.quiz.map((x, idx) => {
                return (
                  <button
                    className={
                      "menu_content_button " +
                      (this.state.status[idx].length > 0
                        ? "menu_content_button_has_answer"
                        : "menu_content_button_not_answer")
                    }
                    key={idx}
                    onClick={() => {
                      this.jump_to_question_and_close_tab(idx);
                    }}
                  >
                    <span>{idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}</span>
                  </button>
                );
              })}
            </div>
            <button
              className={
                "question_overlay_menu_button " +
                (this.state.question_menu_status
                  ? " question_overlay_menu_button_open "
                  : " question_overlay_menu_button_close ")
              }
              onClick={() => this.switch_question_menu_status()}
            >
              <div className="question_overlay_menu_button_img">
                <span>X</span>
              </div>
            </button>
          </div>
          <div className="title_area">
            <div className="title_word_area">
              <span
                className={
                  " title_word " +
                  (this.state.dark_mode
                    ? " title_word_dark_mode_on "
                    : " title_word_dark_mode_off ")
                }
              >
                Question{" "}
                {this.state.index + 1 < 10
                  ? "0" + (this.state.index + 1)
                  : this.state.index + 1}
              </span>
            </div>

            <button
              className={
                "dark_mode_button " +
                (this.state.dark_mode
                  ? " dark_mode_button_on "
                  : " dark_mode_button_off ")
              }
              onClick={() => this.dark_mode_switch()}
            >
              {/* <span className={" dark_mode_button_text " + (this.state.dark_mode? " dark_mode_button_on " :  " dark_mode_button_off ")}>暗黑模式: {this.state.dark_mode ? "on" : "off" } </span> */}
              <span
                className={
                  " dark_mode_button_slider " +
                  (this.state.dark_mode
                    ? " dark_mode_button_slider_on "
                    : " dark_mode_button_slider_off ")
                }
              ></span>
            </button>
            <button
              className="leave_button"
              onClick={() => this.show_leave_menu_or_not()}
            >
              <Image
                className="close_img"
                src={"./img/close.svg"}
                width={30}
                height={30}
                alt="this is close img"
              />
            </button>
          </div>
          <div className="topic">
            <div
              className={
                " topic_bar " +
                (this.state.dark_mode
                  ? " topic_bar_dark_mode_on "
                  : " topic_bar_dark_mode_off ")
              }
            ></div>
            <div
              className={
                " topic_word " +
                (this.state.dark_mode
                  ? " topic_word_dark_mode_on "
                  : " topic_word_dark_mode_off ")
              }
            >
              {this.state.quiz[this.state.index].question_type}
              <br />
              {this.state.quiz[this.state.index].question}
            </div>
          </div>
          <div className="options_area">
            {this.state.quiz[this.state.index].options.map((x, idx) => (
              <div className="option_area" key={idx}>
                <button
                  className="option"
                  onClick={() => this.question_type_depend(idx)}
                >
                  <div
                    className={
                      "option_letter " +
                      (this.state.status[this.state.index].includes(idx)
                        ? " option_letter_choosed "
                        : this.state.dark_mode
                        ? " option_letter_not_choosed_dark_mode_on "
                        : " option_letter_not_choosed_dark_mode_off ")
                    }
                  >
                    {idx + 1}
                  </div>
                  <div
                    className={
                      "option_word_area " +
                      (this.state.status[this.state.index].includes(idx)
                        ? " option_word_area_choosed "
                        : this.state.dark_mode
                        ? " option_word_area_not_choosed_dark_mode_on "
                        : " option_word_area_not_choosed_dark_mode_off ")
                    }
                  >
                    <span className="option_word">{x}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
          <div className="source">
            <h3
              className={
                this.state.dark_mode
                  ? " source_text_dark_mode_on "
                  : " source_text_dark_mode_off "
              }
            >
              Source: this is source
            </h3>
          </div>
          <div className="switch_button_area">
            <button
              className={
                "switch_button " +
                (this.state.index == 0 ? "edge" : "notInEdge")
              }
              disabled={this.state.index == 0}
              onClick={this.sub}
            >
              Previous
            </button>
            <button
              className={
                "switch_button " +
                (this.state.index == this.state.quiz.length - 1
                  ? "submit"
                  : "notInEdge")
              }
              onClick={this.add}
            >
              {this.state.index + 1 == this.state.quiz.length
                ? "Submit"
                : "Next"}
            </button>
          </div>
          <div
            className="progress_bar_area"
            onClick={() => this.switch_question_menu_status()}
          >
            <div className="progress_bar">
              {this.state.status.map((x, idx) => (
                <div
                  key={idx}
                  className={
                    x.length === 0
                      ? this.state.viewed_question.includes(idx)
                        ? " progress_bar_not_selected_has_viewed "
                        : " progress_bar_not_selected_not_viewed "
                      : "progress_bar_has_selected"
                  }
                ></div>
              ))}
            </div>
          </div>
          <div className="time_area">
            {/* 開始時間: */}
            {/* <h1>starttime: {this.state.start_time}</h1> */}
            <span className="time_count_text">
              {this.state.timeCount_display}
            </span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default quiz;
