import apis from "./api";

(async () => {
  const dimensions = await apis.salaryBoostingSkills.listAllDimensions();
  if (dimensions.result) {
    const d = dimensions.result.data[0];
    const data = await apis.salaryBoostingSkills.dimensions(d).salaryBoostingSkills({ id: "15-1251" });

    if (data.result) {
      console.log(JSON.stringify(data, null, " "));
    } else {
      console.warn("Id not found");
    }
  } else {
    console.warn("No dimensions found");
  }
})();
