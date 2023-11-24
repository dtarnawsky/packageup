import { post } from "tiny-json-http";
import { ProjectInfo } from "./inspect";

export async function postProject(projectInfo: ProjectInfo) {    
    const result = await post({ url: 'https://packageup.io/package', data: JSON.stringify(projectInfo), headers: { 'Content-Type': 'application/json' } })
    console.log(result.body);
}