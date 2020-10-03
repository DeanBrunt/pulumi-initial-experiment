import * as pulumi from "@pulumi/pulumi";
import { newGCPProject } from "./lib/gcp/project";
import { ProjectService } from "./lib/gcp/services";

const project = newGCPProject("pulumi-experiment", {
    name: `${pulumi.getStack()}-pulumi-experiment`,
    services: [
        ProjectService.CloudBilling,
        ProjectService.CloudResourceManager,
    ],
});

export const projectId = project.projectId;
