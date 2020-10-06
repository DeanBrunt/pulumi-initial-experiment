import * as pulumi from "@pulumi/pulumi";
import { Project } from "gcp/project";
import { ProjectService } from "gcp/services";

const project = new Project("simple-project", {
    projectName: `${pulumi.getStack()}-pulumi-experiment`,
    services: [
        ProjectService.CloudBilling,
        ProjectService.CloudResourceManager,
    ],
});

export const projectId = project.project.projectId;