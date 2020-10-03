import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";

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

export const projectId = project.projectId;
