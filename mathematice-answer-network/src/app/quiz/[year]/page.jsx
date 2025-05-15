'use client';
import React, { Component } from 'react';
import '../style.css';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { loginOrNot } from '../../../lib/checkCookie';
import { redirect } from 'next/navigation'
class quiz extends Component {
  state = {
    id: 1,
    question_bank: "87年學測",
    quiz: [
      {
        id: 1,
        question:
          "題目一",
        options: ["選項 1", "選項 2", "選項 3", "選項 4", "選項 5"],
        answer: [2, 3],
        explanation:
          "設 P 的位置為 x，則 |x - 1| + |x - 4| = 4。解這個方程式可以得到 x = 1 或 x = 4，因此有 1 個解。",
        question_type: "multiple",
        source: "來源一",
        image: ""
      },
      {
        id: 2,
        question:
          "題目二",
        options: ["選項 1", "選項 2", "選項 3", "選項 4", "選項 5"],
        answer: "3",
        explanation:
          "要使抽到藍色球與抽到1號球的事件互相獨立，則P(藍色) × P(1號) = P(藍色且1號)。\n藍色球總數為2 + 3 = 5顆，綠色球總數為4 + k顆。\n總球數為5 + 4 + k = 9 + k。\nP(藍色) = 5/(9+k)，P(1號) = (2+4)/(9+k) = 6/(9+k)，\nP(藍色且1號) = 2/(9+k)。\n\n所以，5/(9+k) × 6/(9+k) = 2/(9+k)，\n30 = 2(9+k)，\n30 = 18 + 2k，\n12 = 2k，\nk = 6。\n\n因此，k的值為6。",
        question_type: "single",
        source: "來源二",
        image: ""
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
    quiz_mode: 1,
    review_mode: false,
    time_over: false,
    count_time_or_not: true,
  };
  // 這裡fetch題庫資料跟開始計時
  componentDidMount = async () => {
    let jwt_uid = await loginOrNot()
    function compare_array(a, b) {
      return a?.sort().toString() == b?.sort().toString()
    }
    this.state.timeCount_display = this.spend_time_toString(
      this.state.time_limit
    );


    const { year } = await this.props.params;

    let json
    let mydata
    // try {
    mydata = await this.get_question(year, jwt_uid)
    json = mydata.json
    // }

    // catch (error) {
    //   alert("發生錯誤");
    //   window.location.href = "/";
    //   return;
    // }

    // if (year == "review") {
    //   this.state.review_mode = true
    //   let data = await fetch("../api/score", {
    //     method: "POST",
    //     body: JSON.stringify({ uid: jwt_uid }
    //     )
    //   })
    //     .then(res => {

    //       return res?.json();
    //     })

    //   try {
    //     data = await data?.question_record[0].answer_review
    //   } catch (error) {
    //     if (wrong_question?.length == 0 || !wrong_question) {
    //       alert("發生錯誤");
    //       window.location.href = "/";
    //       return;
    //     }
    //   }





    //   let wrong_question = await data.answer_info?.filter(x => !compare_array(x.answer, x.right_answer))

    //   if (wrong_question?.length == 0 || !wrong_question) {
    //     alert("沒有題目需要複習");
    //     window.location.href = "/";
    //     return;
    //   }

    //   json = await fetch("../api/getQuestion", {
    //     method: "POST",
    //     body: JSON.stringify({ question_id: wrong_question.map(x => x.uid) })
    //   }).then(res => res.json())
    // } else {
    //   json = await fetch(`../api/quiz/${year}`)
    //     .then((data) => {
    //       return data.json();
    //     })
    //     ;
    //   if (!(json?.questions.length)) {
    //     alert("找不到題目，請重新設定範圍");
    //     window.location.href = "/question-bank";
    //     return;
    //   }
    // }
    let newState = { ...mydata.newstate };
    if (year == "random") {
      newState.quiz = json.questions;
    } else {
      newState.quiz = await convertdata(json);
    }
    console.log(newState.quiz)
    newState.status = await json.questions.map(() => []);
    newState.id = jwt_uid

    this.setState(newState);

    if (this.state.count_time_or_not) {
      this.setMyInterval();
    }
    this.typesetMath();
  };
  componentDidUpdate = () => {
    this.typesetMath(); // 每次更新後都重新渲染 MathJax
  }
  typesetMath = () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }
  setMyInterval = (event) => {
    if (this.state.mytimeid) {
      clearInterval(this.state.mytimeid);
    }
    this.state.mytimeid = setInterval(() => {
      this.state.time_count += 1;
      if (this.state.time_count > this.state.time_limit) {
        this.state.time_over = true
        this.state.timeCount_display = this.spend_time_toString(
          this.state.time_count - this.state.time_limit
        );
      } else {
        this.state.timeCount_display = this.spend_time_toString(
          this.state.time_limit - this.state.time_count
        );
      }
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
      case "multiple":
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
  show_img = () => {
    let img_path = ""
    let html_element = <></>
    if (this.state.quiz[this.state.index]?.image) {
      img_path = this.state.quiz[this.state.index].image
      html_element =
        // <Image
        //   src={img_path}
        //   width={100}
        //   height={100}
        // />
        <span>
          {img_path}
        </span>
    }
    return html_element
  }
  export_answer_data = () => {
    function compare_array(a, b) {
      return a.sort().toString() == b.sort().toString()
    }
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
    let answer = {
      "answer_info":
        [{
          "uid": 1,
          "answer": [2],
          "right_answer": [2]
        },
        ], "answer_status":
        { "total": 2, "correct": 1 }
    }
    let correct_n = this.state.quiz.filter((question, idx) => {
      return compare_array(this.state.status[idx], translate_letter_to_number(question.answer))
    })
    answer.answer_info = this.state.quiz.map((question, idx) => {
      return ({
        "uid": question.id,
        "answer": this.state.status[idx],
        "right_answer": translate_letter_to_number(question.answer)
      })
    })
    answer.answer_status = {
      "total": this.state.quiz.length,
      "correct": correct_n.length
    }
    return answer
  }
  submit_quiz = () => {
    if (this.state.commit_status) {
      let answer = {
        "answer_info":
          [{
            "uid": 1,
            "answer": [2],
            "right_answer": [2]
          },
          ], "answer_status":
          { "total": 2, "correct": 1 }
      }

      fetch("../api/quizSubmit", {
        method: "POST",
        body: JSON.stringify({
          userid: this.state.id,
          cost_time: this.state.time_count,
          answer: this.export_answer_data(),
          question_bank: decodeURI(this.state.question_bank),
          status: this.state.quiz_mode
        }
        )
      })

    }
  }
  get_question = async (quiz_type, jwt_uid) => {
    let json = { questions: [] }
    let newstate = { ...this.state }

    switch (quiz_type) {
      case "random":
        newstate.quiz_mode = 1
        newstate.question_bank = "即時產生題庫"
        const storedQuestions = await JSON.parse(sessionStorage.getItem("questions"));
        const settings = await JSON.parse(sessionStorage.getItem("settings"));

        if (!storedQuestions || !settings) {
          alert("❌ 找不到題目或設定，請重新開始");
          redirect("/")
        }
        json.questions = storedQuestions ? storedQuestions : [];
        break
      case "review":


        newstate.review_mode = true
        newstate.quiz_mode = 2
        newstate.question_bank = quiz_type
        const data = await fetch("../api/questionToDo", {
          method: "POST",
          body: JSON.stringify({ userid: jwt_uid, mode: 2 }
          )
        }).then(res => {
          return res?.json();
        })
        console.log(data.question_record[0].score_now)
        const data3 = await data.question_record[0].score_now
        
        
        let wrong_question = await data3?.answer_info.answer_info?.filter(x => !compare_array(x.answer, x.right_answer))
        // console.log(wrong_question)
        
        if (wrong_question?.length == 0 || !wrong_question) {
          alert("沒有題目需要複習");
          redirect("/")
        }

        json = await fetch("../api/getQuestion", {
          method: "POST",
          body: JSON.stringify({ question_id: wrong_question.map(x => x.uid) })
        }).then(res => res.json())



        break;
      case "improve":
        newstate.quiz_mode = 3
        let improve_data = await fetch("../api/questionToDo", {
          method: "POST",
          body: JSON.stringify({ userid: jwt_uid, mode: 3 }
          )
        }).then(res => {
          return res?.json();
        })

        let data2 = await improve_data?.question_record[0].wrong_question_set

        if (!data2) {
          alert("沒有題目需要改進");
          redirect("/")

        }


        json = await fetch("../api/getQuestion", {
          method: "POST",
          body: JSON.stringify({ question_id: data2.map(x => x.uid).filter((x, idx) => idx < 50) })
        }).then(res => res.json())
        break;
      default:
        json = await fetch(`../api/quiz/${quiz_type}`)
          .then((data) => {
            return data.json();
          })
          ;
        newstate.question_bank = quiz_type
        if (!(json?.questions.length)) {
          alert("找不到題目，請重新設定範圍");
          redirect("/question-bank")
          return;
        }
        break;
    }


    return ({ "json": json, "newstate": newstate })
  }
  render() {
    return (
      <div className="page_container">
        <div
          className={
            " main  " +
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
                    <Link onNavigate={() => { this.submit_quiz() }} href={this.state.commit_status ? "/score" : "/"}>
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
                        ? " menu_content_button_has_answer "
                        : (this.state.viewed_question.includes(idx) ? " menu_content_button_not_answer " : " menu_content_button_not_view "))
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
              className='leave_button'
              onClick={() => this.show_leave_menu_or_not()}
            >
              <Image
                className='close_img'
                src={'../img/close.svg'}
                width={30}
                height={30}
                alt='this is close img'
              />
            </button>
          </div>
          <div className='topic'>
            <div
              className={
                ' topic_bar ' +
                (this.state.dark_mode
                  ? ' topic_bar_dark_mode_on '
                  : ' topic_bar_dark_mode_off ')
              }
            >
              {this.state.quiz[this.state.index]?.question_type == 'mutiple'
                ? '多選題'
                : '單選題'}
              <button
                className={
                  'dark_mode_button ' +
                  (this.state.dark_mode
                    ? ' dark_mode_button_on '
                    : ' dark_mode_button_off ')
                }
                onClick={() => this.dark_mode_switch()}
              >
                <span
                  className={
                    ' dark_mode_button_slider ' +
                    (this.state.dark_mode
                      ? ' dark_mode_button_slider_on '
                      : ' dark_mode_button_slider_off ')
                  }
                >
                  <Image
                    src={
                      this.state.dark_mode
                        ? '../img/moon.svg'
                        : '../img/sun.svg'
                    }
                    width={20}
                    height={20}
                    alt='this is dark_mode_switch_img'
                  />
                </span>
              </button>
            </div>

            <div
              className={
                " topic_word " +
                (this.state.dark_mode
                  ? " topic_word_dark_mode_on "
                  : " topic_word_dark_mode_off ")
              }
            >
              <div className="topic_img_area">
                {this.show_img()}
              </div>
              <span>
                {this.state.quiz[this.state.index]?.question}
              </span>
            </div>
          </div>
          <div className="options_area">
            {this.state.quiz[this.state.index]?.options.map((x, idx) => (
              <div className="option_area" key={idx}>
                <button
                  className="option"
                  onClick={() => this.question_type_depend(idx + 1)}
                >
                  <div
                    className={
                      "option_letter " +
                      (this.state.status[this.state.index].includes(idx + 1)
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
                      (this.state.status[this.state.index].includes(idx + 1)
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
              來源: {this.state.quiz[this.state.index]?.source}
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
              上一題
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
                ? "提交"
                : "下一題"}
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
          <div style={{ display: this.state.count_time_or_not ? "flex" : "none" }} className="time_area">
            {/* 開始時間: */}
            {/* <h1>starttime: {this.state.start_time}</h1> */}
            <span className={"time_count_text " + (this.state.time_over ? " time_count_over " : " time_count_not_over ")}>
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
function compare_array(a, b) {
  return a.sort().toString() == b.sort().toString()
}
function convertdata(json) {
  let newjson = json.questions.map((x) => {
    return {
      id: x.uid,
      question: x.question,
      options: [x.option_a, x.option_b, x.option_c, x.option_d, x.option_e],
      answer: x.answer,
      explanation: x.explanation,
      question_type: x.type,
      source: x.questionYear,
      image: x.image,
    };
  });

  return newjson;
}
