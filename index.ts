import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";
import { ProjectService } from "./lib/gcp/services";

const randomSuffix = new random.RandomPassword("project-suffix", {
    special: false,
    length: 8,
    upper: false,
    number: false,
});
const projectName = `${pulumi.getStack()}-pulumi-experiment`;

const project = new gcp.organizations.Project("pulumi-experiment-gcp-project", {
    name: projectName,
    projectId: pulumi.interpolate `${projectName}-${randomSuffix.result}`,
});

const servicesToEnable = [
    ProjectService.CloudBilling,
    ProjectService.CloudResourceManager,
];

servicesToEnable.map(
    svc => {
        new gcp.projects.Service(`pulumi-experiment-gcp-project-service-${svc}`, {
            project: project.projectId,
            service: svc,
        })
    }
);

export const projectId = project.projectId;
