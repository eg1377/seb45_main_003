import LogInForm from "../components/login/LoginForm";
import SignupForm from "../components/login/SignupForm";
import Button from "../components/common/Button";
import { useRecoilState } from "recoil";
import { toSignup } from "../atoms/atoms";
import { styled } from "styled-components";

const BackgroundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageContentContainer = styled.div`
  padding: 3rem 1.25rem 3rem 1.25rem;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 1.5rem;

  .bottomContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .guide {
      width: 224px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      gap: 0.75rem;
      .guideTitle {
        text-align: center;
      }
    }
  }

  .labelContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    &:before {
      content: "";
      top: 0.5rem;
      width: 3.125rem;
      height: 0.0625rem;
      background-color: #212121;
    }
    &:after {
      content: "";
      top: 0.5rem;
      width: 3.125rem;
      height: 0.0625rem;
      background-color: #212121;
    }
    .socialLabel {
      padding: 0.5rem 0.75rem;
    }
  }
`;

const LogIn = (): JSX.Element => {
  const [loginPageForm, setloginPageForm] = useRecoilState(toSignup);
  const changeform = () => {
    setloginPageForm(!loginPageForm);
  };
  return (
    <BackgroundContainer>
      {loginPageForm ? (
        <PageContentContainer>
          <h1>로그인</h1>
          <LogInForm />
          <div className="labelContainer">
            <label htmlFor="socialButton" className="socialLabel">
              소셜 로그인
            </label>
          </div>
          <fieldset id="socialButton"></fieldset>
          <div className="bottomContainer">
            <div className="guide">
              <div className="guideTitle">서비스를 처음 방문하셨나요?</div>
              <Button disabled={false} type={"button"} text={"회원가입"} onClick={changeform} />
            </div>
          </div>
        </PageContentContainer>
      ) : (
        <PageContentContainer>
          <h1>회원가입</h1>
          <SignupForm />
          <div className="bottomContainer">
            <div className="guide">
              <div className="guideTitle">이미 계정이 있으신가요?</div>
              <Button disabled={false} type={"button"} text={"로그인"} onClick={changeform} />
            </div>
          </div>
        </PageContentContainer>
      )}
    </BackgroundContainer>
  );
};

export default LogIn;
