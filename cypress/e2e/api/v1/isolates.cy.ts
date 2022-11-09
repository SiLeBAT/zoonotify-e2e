/// <reference types="Cypress" />

describe("Testing the /isolate endpoint", function () {
    const baseUrl = "http://localhost:3000/v1/isolate";
    describe("GET", function () {
        const method = "GET";

        it("should retrieve one E. coli entry from 1995; Sachsen", function () {

            const testIsolateId = "f719dfa0-6779-48c5-998f-4b8f747910f4"
            cy.request({
                method: method,
                log: true,
                url: baseUrl + `/${testIsolateId}`,
                headers: {
                    accept: "application/json",
                },
            }).then(
                (response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body).to.be.a("object");
                    expect(response.body.microorganism).to.equal("E. coli");
                    expect(response.body.samplingYear).to.equal(1995);
                    expect(response.body.federalState).to.equal("Sachsen");
                }
            );
        });

        it("should include all 1687 Campylobacter spp. entries only", function () {
            cy.request({
                method: method,
                log: true,
                url: baseUrl + "/?microorganism=Campylobacter+spp.",
                headers: {
                    accept: "application/json",
                },
            }).then(
                (response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.isolates.length).to.equal(1687);
                    response.body.isolates.forEach((entry: any) => {
                        expect(entry.microorganism).to.be.equal("Campylobacter spp.")
                    })
                }
            );
        });

        it("should include only entries with Matrix=Blinddarminhalt OR (Matrix=Kot AND MatrixDetail=Einzeltierprobe)", function () {

            const numberOfSpecificEntriesInFixture = 3544;
            cy.request({
                method: method,
                log: true,
                url: baseUrl + "/?matrixDetail__Kot=Einzeltierprobe&matrix=Blinddarminhalt",
                headers: {
                    accept: "application/json",
                },
            }).then(
                (response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.isolates.length).to.equal(numberOfSpecificEntriesInFixture);
                    let count = 0;
                    response.body.isolates.forEach((entry: any) => {
                        if (entry.matrix === 'Blinddarminhalt') {
                            count++;
                        }
                        if (entry.matrix === 'Kot' && entry.matrixDetail === 'Einzeltierprobe') {
                            count++;
                        }
                    })
                    expect(count).to.equal(numberOfSpecificEntriesInFixture);
                }
            );
        });

        describe("Microorganism Characteristics", function () {
            it("should NOT include a characteristic key - as E. coli have no characteristics", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=E.+coli",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.empty;
                    }
                );
            });
            it("should include only species key", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=Campylobacter+spp.&microorganism=Enterococcus+spp.",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");
                    }
                );
            });
            it("should include only serovar key", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=Salmonella+spp.",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");

                    }
                );
            });
            it("should include only ampc_carba_phenotype key", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=ESBL%2FAmpC-E.+coli",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");

                    }
                );
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=CARBA-E.+coli",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");

                    }
                );
            });
            it("should include only h_group, o_group and genes key", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=STEC",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");

                    }
                );
            });
            it("should include only serotype key", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=Listeria+monocytogenes",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");

                    }
                );
            });
            it("should include only clonal_group and spa_type key", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?microorganism=MRSA",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        expect(response.body.isolates[0]).to.be.a("object");
                        expect(response.body.isolates[0].characteristics).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serovar).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.species).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.ampc_carba_phenotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.h_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.o_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("string");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("string");
                    }
                );
            })
        })
    });
});
