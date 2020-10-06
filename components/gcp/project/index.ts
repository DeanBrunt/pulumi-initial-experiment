import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as random from "@pulumi/random";
import { ProjectService } from "../services";
import { paramCase } from "change-case";

interface Arguments {
    projectName: string;
    services?: ProjectService[];
    addRandomSuffixToProjectId?: boolean;
}

export class Project extends pulumi.ComponentResource {
    readonly project: gcp.organizations.Project
    private projectServices: gcp.projects.Service[]
    
    constructor(
        name: string, 
        {
            projectName,
            services = [],
            addRandomSuffixToProjectId = true,
        }: Arguments, 
        opts?: pulumi.ResourceOptions
    ) {
        const inputs: pulumi.Inputs = {
            options: opts,
        };
        super("components:gcp:Project", name, inputs, opts);

        // Default resource options for this component's child resources.
        const defaultResourceOptions: pulumi.ResourceOptions = { parent: this };

        let projectId = pulumi.output(paramCase(name))
        if (addRandomSuffixToProjectId) {
            const randomSuffix = new random.RandomString(`${name}-project-random-suffix`, {
                special: false,
                length: 8,
                upper: false,
                number: false,
            }, defaultResourceOptions);
            projectId = pulumi.interpolate `${projectId}-${randomSuffix.result}`;
        }

        this.project = new gcp.organizations.Project(`${name}-project`, {
            name: projectName,
            projectId,
        }, defaultResourceOptions);

        this.projectServices = services.map(
            service => (
                new gcp.projects.Service(`${name}-project-service-${service}`, {
                    project: this.project.projectId,
                    service: service,
                }, defaultResourceOptions)
            )
        )
    }
}
