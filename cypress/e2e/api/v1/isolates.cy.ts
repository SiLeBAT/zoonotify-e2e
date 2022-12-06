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

        it("should include only entries with matrixDetail__Blinddarminhalt=Einzeltierprob OR matrixDetail__Frisches Fleisch=gekühlt", function () {

            cy.request({
                method: method,
                log: true,
                url: baseUrl + "/?matrixDetail__Blinddarminhalt=Einzeltierprobe&matrixDetail__Frisches Fleisch=gekühlt",
                headers: {
                    accept: "application/json",
                },
            }).then(
                (response) => {
                    expect(response.status).to.be.equal(200);
                    response.body.isolates.forEach((entry: any) => {

                        if (entry.matrix === 'Blinddarminhalt') {
                            expect(entry.matrixDetail).to.equal("Einzeltierprobe");
                        }
                        else if (entry.matrix === 'Frisches Fleisch') {
                            expect(entry.matrixDetail).to.equal("gekühlt");
                        }
                        else {
                            expect(true).to.equal(false);
                        }
                    })
                }
            );
        });

        describe("Microorganism Characteristics", function () {
            it("should NOT include a characteristic key: E. coli have no characteristics", function () {
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
                        expect(response.body.isolates[0].characteristics).to.be.a("undefined");
                    }
                );
            });
            it("should include only species key: applicable to Campylobacter+spp. && Enterococcus+spp.", function () {
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
            it("should include only serovar key: applicable to Salmonella spp.", function () {
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
            it("should include only ampc_carba_phenotype key: applicable to ESBL/AmpC-E. coli", function () {
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
            it("should include only h_group, o_group and genes key: applicable to STEC", function () {
                /*
                Example response:
{
    "isolateId": "85",
    "bfrId": "b95e58e2-5fd5-4385-8f54-53ca6acd98b3",
    "microorganism": "STEC",
    "samplingYear": 1995,
    "federalState": "Sachsen",
    "samplingContext": "Zoonosen-Monitoring",
    "samplingStage": "Einzelhandel",
    "origin": "Lebensmittel",
    "category": "kleine Wiederkäuer",
    "productionType": "Lamm",
    "matrix": "Frisches Fleisch",
    "matrixDetail": "gekühlt oder tiefgefroren",
    "characteristics": {
        "o_group": "116",
        "h_group": "15",
        "genes": {
            "stx_1": false,
            "stx_2": true,
            "eae": false,
            "e_hly": null,
        }
    },
    "resistance": {
        "GEN": {
            "active": false,
            "value": "0.5"
        },
        "CHL": {
            "active": false,
            "value": "8"
        },
        "CIP": {
            "active": false,
            "value": "0.015"
        },
        "TMP": {
            "active": false,
            "value": "0.25"
        },
        "SMX": {
            "active": false,
            "value": "8"
        },
        "TET": {
            "active": false,
            "value": "2"
        },
        "FOT": {
            "active": false,
            "value": "0.25"
        },
        "TAZ": {
            "active": false,
            "value": "0.5"
        },
        "NAL": {
            "active": false,
            "value": "4"
        },
        "AMP": {
            "active": false,
            "value": "4"
        },
        "COL": {
            "active": false,
            "value": "1"
        },
        "AZI": {
            "active": false,
            "value": "4"
        },
        "TGC": {
            "active": false,
            "value": "0.25"
        },
        "MERO": {
            "active": false,
            "value": "0.03"
        }
    }
}
                */
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
                        expect(response.body.isolates[0].characteristics.genes).to.be.a("object");
                        expect(response.body.isolates[0].characteristics.serotype).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.clonal_group).to.be.a("undefined");
                        expect(response.body.isolates[0].characteristics.spa_type).to.be.a("undefined");

                    }
                );
            });
            it("should not include e_hly gene", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/9e074b54-22af-4a57-9b30-ede92de6c98b",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.characteristics.o_group).to.equal(("116"))
                        expect(response.body.characteristics.h_group).to.equal("NM");
                        expect(response.body.characteristics.genes.stx1).to.equal(false);
                        expect(response.body.characteristics.genes.stx2).to.equal(true);
                        expect(response.body.characteristics.genes.eae).to.equal(false);
                        expect(response.body.characteristics.genes.e_hly).to.equal(null);
                    }
                );
            });
            it("should include e_hly gene", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/b95e58e2-5fd5-4385-8f54-53ca6acd98b3",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.characteristics.o_group).to.equal("15");
                        expect(response.body.characteristics.h_group).to.equal("[H27]");
                        expect(response.body.characteristics.genes.stx1).to.equal(true);
                        expect(response.body.characteristics.genes.stx2).to.equal(true);
                        expect(response.body.characteristics.genes.eae).to.equal(false);
                        expect(response.body.characteristics.genes.e_hly).to.equal(false);

                    }
                );
            });
            it("should include only serotype key: applicable to Listeria monocytogene", function () {
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
            it("should include only clonal_group and spa_type key: applicable to MRSA", function () {
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
            it("should include only stx1 positive STEC samples", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?genes__STEC=stx1",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        response.body.isolates.forEach((isolate: any) => {
                            expect(isolate.characteristics.genes.stx1).to.equal(true);
                            expect(isolate.microorganism).to.be.equal('STEC');
                        })


                    }
                );
            });
            it("should include only stx1 && stx2 positive STEC samples", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?genes__STEC=stx1&genes__STEC=stx2",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        response.body.isolates.forEach((isolate: any) => {
                            expect(isolate.characteristics.genes.stx1).to.equal(true);
                            expect(isolate.characteristics.genes.stx2).to.equal(true);
                            expect(isolate.microorganism).to.be.equal('STEC');
                        })


                    }
                );
            });

            it("should include only O_group = 100 && h_group = NM  STEC samples", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?o_group__STEC=100&h_group__STEC=NM",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        response.body.isolates.forEach((isolate: any) => {
                            expect(isolate.characteristics.o_group).to.equal("100");
                            expect(isolate.characteristics.h_group).to.equal("NM");
                            expect(isolate.microorganism).to.be.equal('STEC');
                        })


                    }
                );
            });

            it("should include only spa_type__MRSA=t001 OR spa_type__MRSA=t008  MRSA samples", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?spa_type__MRSA=t001&spa_type__MRSA=t008",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        response.body.isolates.forEach((isolate: any) => {
                            expect(isolate.characteristics.spa_type).to.equal("t001");
                            expect(isolate.characteristics.spa_type).to.equal("t008");
                            expect(isolate.microorganism).to.be.equal('MRSA');
                        })


                    }
                );
            });
        })

        describe("Microorganism AMR", function () {
            it("should only include AMR positive STEC samples", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?resistance__STEC=AMR",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        response.body.isolates.forEach((isolate: any) => {
                            expect(isolate.resistance.AMR.active).to.be.equal(true);
                            expect(isolate.microorganism).to.be.equal('STEC');
                        })
                    }
                );
            });
            it("should only include AMR && AZI positive STEC samples", function () {
                cy.request({
                    method: method,
                    log: true,
                    url: baseUrl + "/?resistance__STEC=AMR&resistance__STEC=AZI",
                    headers: {
                        accept: "application/json",
                    },
                }).then(
                    (response) => {
                        expect(response.status).to.be.equal(200);
                        expect(response.body.isolates).to.be.a("array");
                        response.body.isolates.forEach((isolate: any) => {
                            expect(isolate.resistance.AMR.active).to.be.equal(true);
                            expect(isolate.resistance.AZI.active).to.be.equal(true);
                            expect(isolate.microorganism).to.be.equal('STEC');
                        })
                    }
                );
            });
        })
    });
});
