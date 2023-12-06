import { RestClient } from "./lib/rest-client";
import canadaJobPostingsAPI from "./lib/ca-jpa";
import classificationAPI from "./lib/classification";
import skillsAPI from "./lib/skills";
import careerPathwaysAPI from "./lib/career-pathways";

export default class API extends RestClient {
  readonly skills = skillsAPI(this);
  readonly cajpa = canadaJobPostingsAPI(this);
  readonly classification = classificationAPI(this);
  readonly careerPathways = careerPathwaysAPI(this);
}

/*
const api = new API({ client_id: "", client_secret: "", grant_type: "client_credentials", scope: "" });
api.careerPathways.dimensions.listAll();
api.careerPathways.dimensions.dimension("lotspecocc").bulk({ id: "" });
*/

/*
const data = api.skills?.version("latest").meta();
const data1 = api.caJpa?.postings.byId("");
const data2 = api.caJpa?.taxonomies.byFacet("");
const data3 = api.caJpa?.taxonomies.lookup.byFacet("", { ids: [] });
const data4 = api.caJpa?.totals({});
const data5 = api.caJpa?.taxonomies();
const data6 = api.caJpa?.distributions.byFacet("max_years_experience", {});
const data7 = api.caJpa?.distributions();
*/
