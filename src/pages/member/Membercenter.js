import React, { useState, useContext, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AuthContext from '../../pages/member/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// import './Membercenter.css';
function Membercenter() {
  const { authorized, token, account, level, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  //如未登入轉出至首頁
  if (authorized === false) {
    navigate('/');
  }

  // 第一次記錄伺服器的原始資料用
  const [usersRaw, setUsersRaw] = useState('');
  // 呈現資料用
  const [usersDisplay, setUsersDisplay] = useState('');
  //avatar cstate
  const [pickedAvatar, setPickedAvatar] = useState(false);
  const [avatarName, setAvatarName] = useState('');

  //是否正在修改
  const [isOnchange, setIsOnchange] = useState(false);
  //抓用戶輸入會員資料的值
  const [regForm, setRegForm] = useState({
    birthday: '',
    email: '',
    mobiel: '',
    address: '',
    account: '',
  });

  const [regFormError, setRegFormError] = useState({
    birthday: '',
    email: '',
    mobile: '',
    address: '',
  });

  //大頭貼模擬點擊
  const avatarpic = useRef('');

  //一進入會員中心頁面拿取資料庫資料&設入state
  const getdata = async () => {
    const response = await axios.get(
      'http://localhost:3600/member/memberdata',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const r = response.data;
    const res_data = r[0];
    setUsersRaw(res_data);
    // 生日格式處理
    const date = r[0].birthday;
    const slicedate = date.slice(0, 10);
    const newDisplay = { ...res_data, birthday: slicedate };
    setUsersDisplay(newDisplay);
  };

  useEffect(() => {
    getdata();
  }, []);
  //to do 模擬點擊???????-----------------------------------------------

  // const file = e.target;
  // console.log(file)
  // const file = e.target.files[0];

  //大頭貼上傳至後端資料夾
  //to do 大頭貼寫入資料庫--------------------------------------------

  const avatarchange = () => {
    const fd = new FormData(document.avatar_form);
    fetch('http://localhost:3600/member/yuupload', {
      method: 'POST',
      body: fd,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setAvatarName(data.filename);
      });
  };
  //錯誤訊息
  // 表單用，有不合法的驗証出現時會觸發
  const handleInvalid = (e) => {
    // 先阻擋預設行為-泡泡訊息
    e.preventDefault();

    // 錯誤訊息
    // console.log(e.target.validationMessage);

    // 填入錯誤訊息
    setRegFormError({
      ...regFormError,
      [e.target.name]: e.target.validationMessage,
    });
  };

  //給表單用,使用者回來修正錯誤,使用onchange錯誤訊息更新
  const errorCheck = (e) => {
    setRegFormError({
      ...regFormError,
      [e.target.name]: '',
    });
  };
  ///抓取用戶正在輸入資料的值
  const changeFields = (event) => {
    const id = event.target.id;
    const val = event.target.value;
    console.log({ id, val });
    setIsOnchange(true);
    setRegForm({
      ...regForm,
      [id]: val,
      level: usersDisplay.level,
      account: usersDisplay.account,
    });
    console.log(regForm);
  };
  //修改會員資料
  const update_member_data = async (event) => {
    event.preventDefault();
    if (window.confirm('確定要修改會員資料嗎?') === false) {
      return;
    }
    fetch('http://localhost:3600/member/memberupdate', {
      method: 'POST',
      body: JSON.stringify(regForm),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then((result) => {
        setUsersDisplay(result);
      });
  };

  return (
    <>
      <div className="h_full container yu_container">
        <header className="yu_header">
          <h2>會員中心</h2>
        </header>
        <nav className="yu_bar_nav">
          <div className="container yu_container">
            <ul className="yu_bar_ul">
              <li>
                <Link className="nav-link" to="/MemberHistory">
                  <i className="fa-solid fa-user"></i>歷史訂單
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/MemberPsdchange">
                  <i className="fa-solid fa-user"></i>密碼更新
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/MemberPsdchange">
                  <i className="fa-solid fa-user"></i>發布評論
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="yu_profile">
          <div className="row-6 d-flex ">
            <div className="col">
              <div className="yu_avatar_upload">
                <figure className="d-flex yu_avatar_pic">
                  <img
                    src={`http://localhost:3600/yuimgs/${avatarName}`}
                    alt=""
                  />
                </figure>
                <div className="d-flex justify-content-center yu_avatar_upload">
                  <button
                    className="yu_avatar_btn"
                    onClick={() => {
                      avatarpic.current.click();
                    }}
                  >
                    上傳照片
                  </button>
                  <form name="avatar_form">
                    <input
                      type="file"
                      multiple
                      name="avatar"
                      accept="images/jpeg,images/png"
                      onChange={avatarchange}
                      style={{ display: 'none' }}
                      ref={avatarpic}
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="col-6 yu_profile_editing">
              <div className="yu_member_title">
                <p>
                  {isOnchange ? regForm.account : usersDisplay.account}
                  目前會員等級 {isOnchange ? regForm.level : usersDisplay.level}
                </p>
              </div>
              <form
                className="yu_flex"
                onInvalid={handleInvalid}
                onSubmit={update_member_data}
                onChange={errorCheck}
              >
                <div className="yu_profile_form_group form-group">
                  <label htmlFor="birthday" className="col-3">
                    生日
                  </label>
                  <input
                    type="date"
                    className="birthday col-8"
                    name="birthday"
                    id="birthday"
                    placeholder="birthday"
                    value={
                      isOnchange ? regForm.birthday : usersDisplay.birthday
                    }
                    onChange={changeFields}
                    required
                  />
                  <p className="error">{regFormError.birthday}</p>
                </div>
                <div className="yu_profile_form_group  form-group">
                  <label htmlFor="email" className="col-3">
                    電子郵件
                  </label>
                  <input
                    type="email"
                    className="email col-8"
                    name="email"
                    id="email"
                    placeholder="email"
                    value={isOnchange ? regForm.email : usersDisplay.email}
                    onChange={changeFields}
                  />
                  <p className="error">{regFormError.email}</p>
                </div>
                <div className="yu_profile_form_group  form-group">
                  <label htmlFor="mobile" className="col-3">
                    連絡電話
                  </label>
                  <input
                    type="mobile"
                    className="mobile col-8"
                    name="mobile"
                    id="mobile"
                    placeholder="mobile"
                    value={isOnchange ? regForm.mobile : usersDisplay.mobile}
                    onChange={changeFields}
                    required
                  />
                  <p className="error">{regFormError.mobile}</p>
                </div>
                <div className="yu_profile_form_group  form-group">
                  <label htmlFor="address" className="col-3">
                    地址
                  </label>
                  <input
                    type="address"
                    className="address col-8"
                    name="address"
                    id="address"
                    placeholder="address"
                    value={isOnchange ? regForm.address : usersDisplay.address}
                    onChange={changeFields}
                    required
                  />
                  <p className="error">{regFormError.address}</p>
                </div>
                <div className="yu_profile_form_group form-group">
                  <input
                    type="text"
                    className="birthday col-8"
                    name="level"
                    id="level"
                    value={usersDisplay.level}
                    style={{ display: 'none' }}
                  />
                </div>{' '}
                <div className="yu_profile_form_group form-group">
                  <input
                    type="text"
                    className="birthday col-8"
                    name="account"
                    id="account"
                    value={usersDisplay.account}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="d-flex ">
                  <button type="submit" className=" mt-5 yu_profile-btn">
                    修改會員資料
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <header className="yu_header">
          <h2>里程碑</h2>
        </header>
        <div className="yu_milestone d-flex">
          <div className="step">
            <div className="stone">
              <div className="yu_stone_figure">
                <img src="../images/catpaw.svg" alt="" />
              </div>
              <p className="yu_milestone_text">完成資料修改</p>
            </div>
          </div>
          <div className="step">
            <div className="stone">
              <div className="yu_stone_figure">
                <img src="../images/catpaw.svg" alt="" />
              </div>
              <p className="yu_milestone_text">完成一筆訂單</p>
            </div>
          </div>
          <div className="step">
            <div className="stone">
              <div className="yu_stone_figure">
                <img src="../images/catpaw.svg" alt="" />
              </div>
              <p className="yu_milestone_text">完成五筆訂單</p>
            </div>
          </div>
          <div className="step">
            <div className="stone">
              <div className="yu_stone_figure">
                <img src="../images/catpaw.svg" alt="" />
              </div>
              <p className="yu_milestone_text">單筆訂單滿xxx元</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Membercenter;
