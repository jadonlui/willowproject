import React from 'react';
// import './Login.css';
import '../../components/Member/Eye.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../member/components/AuthContext';
import cat from './images/logincat.svg';
import catHide from './images/logincat_blind.svg';
import eye from './images/Eye.svg';
import eyeSlash from './images/EyeSlash.svg';

function Login() {
  //設定密碼眼睛&貓貓
  // const [eye, setEye] = useState('password');

  const [isCatHide, setIsCatHide] = useState(false);
  const [isHide, setIsHide] = useState(true);

  const checkIfHide = (e) => {
    console.log('hi', e.target.tagName);
    if (e.target.tagName === 'INPUT' && e.type === 'focus') {
      setIsCatHide(isHide);
    } else if (e.target.tagName === 'INPUT' && e.type === 'blur') {
      setIsCatHide(false);
    } else if (e.target.tagName === 'DIV') {
      setIsCatHide(false);
    } else if (e.target.tagName === 'IMG') {
      const nowHide = !isHide;
      setIsCatHide(nowHide);
      setIsHide(nowHide);
    }
  };


  //設定登入資料
  const [myform, setMyform] = useState({
    account: '',
    password: '',
  });

  const changeFields = (event) => {
    const id = event.target.id;
    const val = event.target.value;
    console.log({ id, val });
    setMyform({ ...myform, [id]: val });

  };

  //轉頁
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const whenSubmit = (event) => {
    event.preventDefault();

    console.log(myform);
    // TODO: 欄位檢查-----------------------------------------------------------------
    if (myform.account === "" || myform.password === "") {
      return
    }
    fetch('http://localhost:3600/login-jwt', {
      method: 'POST',
      body: JSON.stringify(myform),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          //登入成功 寫進localstorage & 跳轉到首頁
          //登入成功需刷新才能更改navbar -->使用authorized判定-->result 把authcontext的authorized放進去
          //登入成功會發回來 該會員 token account 及會員等級
          localStorage.setItem('auth', JSON.stringify(result.data));
          console.log(result.data);
          setAuth({
            ...result.data,
            authorized: true,
          });
          alert('登入成功!');
          // navigate('/');
        } else {
          alert('帳密錯誤');
        }
      });
  };

  // const toggleEye = () => {
  //   console.log('toggle Eye');

  //   setIsHidePass(!isHidePass);
  //   if (eye === 'password') {
  //     setEye('text');
  //     // setPic('../../../images/Eye.svg');
  //     // setCat('../../../images/logincat_blind.svg');
  //   } else {
  //     setEye('password');
  //     // setCat('../../../images/logincat_blind.svg');
  //     // setPic('../../../images/EyeSlash.svg');
  //   }
  // };

  // const blurtexting = () => {
  //   setCat('../../../images/logincat.svg');
  // };

  // useEffect(() => {
  //   setCat('../../../images/logincat.svg');
  //   return () => {
  //     // Clean up the subscription
  //     setCat('../../../images/logincat_blind.svg')
  //   };
  // },[eye]);

  return (
    <>
      <div className="container yu_container" onClick={checkIfHide}>
        <header className="yu_header">
          <p>會員登入</p>
        </header>
        <div className="row">
          <div className="col">
            <div className="logincat d-flex justify-content-center">
              <img
                src={isCatHide ? catHide : cat}
                alt=""
              />
              {/* <img src="../../../images/logincat_blind.svg" alt="" /> */}
            </div>
            <form action="" onSubmit={whenSubmit}>
              <div className="yu_logincard d-flex">
                <div className="yu_inputblock">
                  <label htmlFor="">帳號</label>
                  <input
                    id="account"
                    name="account"
                    type="text"
                    value={myform.account}
                    onChange={changeFields}
                  />
                </div>
                <div className="yu_inputblock ">
                  <label htmlFor="">密碼</label>
                  <input
                    id="password"
                    type={isHide ? 'password' : 'text'}
                    name="passwrod"
                    onChange={changeFields}
                    onFocus={checkIfHide}
                    onBlur={checkIfHide}
                    value={myform.password}
                  />
                  <div className="yu_logineye_absolute" onClick={checkIfHide}>
                    <img
                      className="yu_logineye"
                      src={isHide ? eyeSlash : eye}
                      alt=""
                    />
                  </div>
                  <a href="#/">忘記密碼</a>
                </div>
                <button className="ProjectButton">登入</button>
              <p>
                第一次光臨嗎?
                <Link to="/MemberRegister">點此註冊</Link>
              </p>
              <p>
                <Link className="nav-link" to="/adminlogin">
                  admin
                </Link>
              </p>
              </div>
            </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;