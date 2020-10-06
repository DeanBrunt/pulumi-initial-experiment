import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";
import { ProjectService } from "../services";
import { paramCase } from "change-case";

interface Options {
    name: string;
    services?: ProjectService[];
    addRandomSuffixToProjectId?: boolean;
}

export const newGCPProject = (
    resourceNameBase: string, 
    {
        name,
        services = [],
        addRandomSuffixToProjectId = true,
    }: Options,
): gcp.organizations.Project => {
    // TODO(DeanBrunt): Find out the proper way to declare this sort of type as this is a bit hacky
    let projectId = pulumi.interpolate `${paramCase(name)}`;
    if (addRandomSuffixToProjectId) {
        const randomSuffix = new random.RandomString(`${resourceNameBase}-project-random-suffix`, {
            special: false,
            length: 8,
            upper: false,
            number: false,
        });
        projectId = pulumi.interpolate `${projectId}-${randomSuffix.result}`
    }

    const project = new gcp.organizations.Project(`${resourceNameBase}-project`, {
        name,
        projectId,
    });

    services.map(
        service => {
            new gcp.projects.Service(`${resourceNameBase}-project-service-${service}`, {
                project: project.projectId,
                service: service,
            })
        }
    )

    return project;
};