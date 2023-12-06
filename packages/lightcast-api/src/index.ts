import { RestClient } from "./lib/rest-client";
import canadaJobPostingsAPI from "./lib/ca-jpa";
import classificationAPI from "./lib/classification";
import skillsAPI from "./lib/skills";
import careerPathwaysAPI from "./lib/career-pathways";

export class LightcastAPIs extends RestClient {
  readonly skills = skillsAPI(this);
  readonly cajpa = canadaJobPostingsAPI(this);
  readonly classification = classificationAPI(this);
  readonly careerPathways = careerPathwaysAPI(this);
}
