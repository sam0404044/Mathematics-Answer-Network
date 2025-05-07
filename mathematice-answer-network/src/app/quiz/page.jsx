"use client";

import React, { Component } from "react";
import Image from "next/image";
import Footer from "../components/Footer";
import "./style.css"
export default class Quiz extends Component {
  state = {
    quiz: [],
    index: 0,
    status: [],
    viewed_question: [0],
    question_menu_status: false,
    exit_menu_status: false,
    commit_status: false,
    dark_mode: false,
    time_count: 0,
    mytimeid: 0,
    time_limit: 3600,
    timeCount_display: "00:00",
    settings: null,
  };

  componentDidMount = () => {
    const stored = sessionStorage.getItem("questions");
    const settingData = sessionStorage.getItem("settings");
    if (stored && settingData) {
      const parsed = JSON.parse(stored);
      const settings = JSON.parse(settingData);
      this.setState({
        quiz: parsed,
        settings,
        status: parsed.map(() => []),
        timeCount_display: this.spend_time_toString(this.state.time_limit),
      });
      if (settings.timerEnabled) this.setMyInterval();
    }
  };

  componentWillUnmount = () => {
    sessionStorage.removeItem("questions");
    sessionStorage.removeItem("settings");
    if (this.state.mytimeid) clearInterval(this.state.mytimeid);
  };

  setMyInterval = () => {
    const intervalId = setInterval(() => {
      this.setState((prev) => {
        const newCount = prev.time_count + 1;
        if (newCount > prev.time_limit) {
          clearInterval(intervalId);
          alert("時間到");
        }
        return {
          time_count: newCount,
          timeCount_display: this.spend_time_toString(prev.time_limit - newCount),
        };
      });
    }, 1000);
    this.setState({ mytimeid: intervalId });
  };

  spend_time_toString = (time) => {
    let min = ("0" + Math.floor(time / 60)).slice(-2);
    let sec = ("0" + (time % 60)).slice(-2);
    return `${min}:${sec}`;
  };

  add = () => {
    if (this.state.index === this.state.quiz.length - 1) return;
    const next = this.state.index + 1;
    this.setState((prev) => ({
      index: next,
      viewed_question: [...new Set([...prev.viewed_question, next])],
    }));
  };

  sub = () => {
    if (this.state.index === 0) return;
    const prevIndex = this.state.index - 1;
    this.setState((prev) => ({
      index: prevIndex,
      viewed_question: [...new Set([...prev.viewed_question, prevIndex])],
    }));
  };

  choose_single = (index) => {
    this.setState((prev) => {
      const updatedStatus = [...prev.status];
      updatedStatus[prev.index] = [index];
      return { status: updatedStatus };
    });
  };

  question_type_depend = (index) => {
    this.choose_single(index); // 可擴充為多選題時改寫
  };

  render() {
    const { quiz, index, status, dark_mode, timeCount_display, settings } = this.state;
    if (!quiz.length || !settings) return <p>載入中...</p>;
    const q = quiz[index];
    const selected = status[index] || [];
    const filteredOptions = q.options.filter((opt) => opt !== null && opt.trim() !== "");

    return (
      <div className="page_container">
        <div className={`main ${dark_mode ? "main_dark_mode_on" : "main_dark_mode_off"}`}>
          <div className="title_area">
            <div className="title_word_area">
              <span className={`title_word ${dark_mode ? "title_word_dark_mode_on" : "title_word_dark_mode_off"}`}>
                Question {index + 1 < 10 ? "0" + (index + 1) : index + 1}
              </span>
            </div>
            <button
              className={`dark_mode_button ${dark_mode ? "dark_mode_button_on" : "dark_mode_button_off"}`}
              onClick={() => this.setState({ dark_mode: !dark_mode })}
            >
              <span
                className={`dark_mode_button_slider ${dark_mode ? "dark_mode_button_slider_on" : "dark_mode_button_slider_off"}`}
              ></span>
            </button>
          </div>

          <div className="topic">
            <div className={dark_mode ? "topic_bar_dark_mode_on" : "topic_bar_dark_mode_off"}></div>
            <div className={`topic_word ${dark_mode ? "topic_word_dark_mode_on" : "topic_word_dark_mode_off"}`}>
              {q.question}
            </div>
          </div>

          <div className="options_area">
            {filteredOptions.map((opt, idx) => (
              <div className="option_area" key={idx}>
                <button className="option" onClick={() => this.question_type_depend(idx)}>
                  <div
                    className={`option_letter ${
                      selected.includes(idx)
                        ? "option_letter_choosed"
                        : dark_mode
                        ? "option_letter_not_choosed_dark_mode_on"
                        : "option_letter_not_choosed_dark_mode_off"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div
                    className={`option_word_area ${
                      selected.includes(idx)
                        ? "option_word_area_choosed"
                        : dark_mode
                        ? "option_word_area_not_choosed_dark_mode_on"
                        : "option_word_area_not_choosed_dark_mode_off"
                    }`}
                  >
                    <span className="option_word">{opt}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="switch_button_area">
            <button
              className={`switch_button ${index === 0 ? "edge" : "notInEdge"}`}
              onClick={this.sub}
              disabled={index === 0}
            >
              上一題
            </button>
            <button
              className={`switch_button ${index === quiz.length - 1 ? "submit" : "notInEdge"}`}
              onClick={this.add}
            >
              {index === quiz.length - 1 ? "交卷" : "下一題"}
            </button>
          </div>

          <div className="time_area">
            <span className="time_count_text">{settings.timerEnabled ? timeCount_display : "不限時"}</span>
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}