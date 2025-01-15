'use client';
import pageStyles from "./preferences.module.css";
import InputField from "../components/InputField";
import Button from '../../components/Button'
import SelectorBox from "./components/SelectorBox";

function getUserData() {
    console.log('pass');
}

export default function Preferences() {
  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.right}>
        <h1>projects</h1>
        <SelectorBox items={["Really eraal long nname", "Project", "Project", "Project", "Project", "Project", "Project", "Project", "Project", "Project", "Project", "Project", "Project"]} />
      </div>
      <div className={pageStyles.middle}>
        <div className={pageStyles.middleContent}>
            Your GitHub username is how we link information like your commits and repositories.
            <InputField placeholder="GitHub username"/>
        </div>
        <div className={pageStyles.middleContent}>
            Your Leetcode username is how we link information like your submissions and solutions.
            <InputField placeholder="Leetcode username"/>
        </div>
        <div className={pageStyles.middleContent}>
        <Button
        onClick={() => getUserData()} variant="primary" width="100px"
        >
        fetch your data
        </Button>
        </div>
      </div>

      <div className={pageStyles.left}>
      <h1>languages</h1>
      <SelectorBox items={["JavaScript", "Python", "C++", "Java", "Go", "SmallTalk", "Perl", "PHP", "Ruby", "C#"]} />
      </div>
    </div>
  );
}
