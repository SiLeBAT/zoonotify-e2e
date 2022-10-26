/// <reference types="Cypress" />

describe("Testing the /isolate endpoint", function () {
    const baseUrl = "http://localhost:3000/v1/isolate";
    describe("GET", function () {
        const method = "GET";

        it("should retrieve one entry which includes required keys", function () {
            cy.request({
                method: method,
                log: true,
                url: baseUrl + "/1",
                headers: {
                    accept: "application/json",
                },
            }).then(
                (response) => {
                    expect(response.status).to.be.equal(200);
                    expect(response.body.isolates).to.be.a("array");
                    expect(response.body.isolates.length).to.equal(1);
                    expect(response.body.isolates[0]).to.be.a("object");
                    expect(response.body.isolates[0].microorganism).to.be.a("string");
                    expect(response.body.isolates[0].samplingYear).to.be.a("number");
                    expect(response.body.isolates[0].federalState).to.be.a("string");
                    expect(response.body.isolates[0].samplingContext).to.be.a("string");
                    expect(response.body.isolates[0].samplingStage).to.be.a("string");
                    expect(response.body.isolates[0].origin).to.be.a("string");
                    expect(response.body.isolates[0].category).to.be.a("string");
                    expect(response.body.isolates[0].productionType).to.be.a("string");
                    expect(response.body.isolates[0].matrix).to.be.a("string");
                    expect(response.body.isolates[0].matrixDetail).to.be.a("string");
                    expect(response.body.isolates[0].characteristics).to.be.a("object");
                    expect(response.body.isolates[0].resistance).to.be.a("object");
                }
            );
        });

        it("should include all 1709 Campylobacter spp. entries only", function () {
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
                    expect(response.body.isolates.length).to.equal(1709);
                    response.body.isolates.forEach((entry: any) => {
                        expect(entry.microorganism).to.be.equal("Campylobacter spp.")
                    })
                }
            );
        });

        it("should include only entries with Matrix=Blinddarminhalt OR (Matrix=Kot AND MatrixDetail=Einzeltierprobe)", function () {
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
                    expect(response.body.isolates.length).to.equal(3459);
                    let count = 0;
                    response.body.isolates.forEach((entry: any) => {
                        if (entry.matrix === 'Blinddarminhalt') {
                            count++;
                        }
                        if (entry.matrix === 'Kot' && entry.matrixDetail === 'Einzeltierprobe') {
                            count++;
                        }
                    })
                    expect(count).to.equal(3459);
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
