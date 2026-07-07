// src/utils/departments.js
export const departments = [
  { value: "SCES", label: "School of Computing and Engineering Sciences" },
  { value: "SIMS", label: "School of Informatics and Mathematical Sciences" },
  { value: "SUBS", label: "School of Business" },
  { value: "SHSS", label: "School of Humanities and Social Sciences" },
  { value: "SLS", label: "School of Law" },
  { value: "SI", label: "Strathmore Institute" },
];

export const departmentOptions = departments.map((dept) => ({
  value: dept.value,
  label: `${dept.value} - ${dept.label}`,
}));

export const getDepartmentLabel = (value) => {
  const dept = departments.find((d) => d.value === value);
  return dept ? dept.label : value;
};

export const getDepartmentFull = (value) => {
  const dept = departments.find((d) => d.value === value);
  return dept ? `${dept.value} - ${dept.label}` : value;
};
