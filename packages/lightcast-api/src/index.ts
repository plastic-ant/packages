import { RestClient } from "./lib/rest-client";
import jobPostingsAPI from "./lib/jpa";
import canadaJobPostingsAPI from "./lib/ca-jpa";
import classificationAPI from "./lib/classification";
import skillsAPI from "./lib/skills";
import careerPathwaysAPI from "./lib/career-pathways";
import salaryBoostingSkillsAPI from "./lib/salary-boosting-skills";

export class LightcastAPIs extends RestClient {
  readonly skills = skillsAPI(this);
  readonly jpa = jobPostingsAPI(this);
  readonly cajpa = canadaJobPostingsAPI(this);
  readonly classification = classificationAPI(this);
  readonly careerPathways = careerPathwaysAPI(this);
  readonly salaryBoostingSkills = salaryBoostingSkillsAPI(this);
}
