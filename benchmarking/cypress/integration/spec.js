/* eslint-env mocha */
/* global cy, expect */
import Ajv from "ajv";
import yaml from "js-yaml";
import { getVersions } from "../../src/utils/arrange.mjs";
import configuration from "../../src/configuration.js";

const route = `/datasets/${configuration.DEFAULT_DATA_SET}.json`;

describe("/", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("has the correct <h1>", () => {
    cy.get("h1")
      .invoke("text")
      .should("eq", "JavaScript Test Data");
  });
  it(`links to ${route}`, () => {
    cy.get("[data-cy=data]").should("have.attr", "href", route);
  });
  it("links to /schema.json", () => {
    cy.get("[data-cy=schema]").should("have.attr", "href", "/schema.json");
  });
  it(`links to v2`, () => {
    cy.get("p a:first").should("have.attr", "href", "overview/v2");
  });
});
describe("/overview/v2", () => {
  beforeEach(() => {
    cy.visit("/overview/v2");
  });
  it(`links to v1`, () => {
    cy.get("p a:first").should("have.attr", "href", "overview/v1");
  });
});

describe(route, () => {
  it("returns JSON", () => {
    cy.request(route)
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });
  it("validate against schema.yaml", function() {
    /*
     * For more helpful debug messages, download with curl and run:
     * npx ajv-cli validate -s schema.json -d data.json
     */

    let validate;

    cy.readFile("schema.yaml", {
      encoding: "utf8"
    }).then(yaml_schema => {
      const ajv = new Ajv();
      const json = yaml.safeLoad(yaml_schema);
      validate = ajv.compile(json);
    });

    cy.request(route)
      .its("body")
      .should(body => expect(validate(body)).to.be.true);
  });
  it("versions should be in the correct order", () => {
    const order = [
      "3.7.17 2013-05-20 00:56:22 118a3b35693b134d56ebd780123b7fd6f1497668",
      "3.30.1 2019-10-10 20:19:45 18db032d058f1436ce3dea84081f4ee5a0f2259ad97301d43c426bc7f3df1b0b",
      "3.7.17 c896ea8 LMDB_0.9.9  7449ca6",
      "3.7.17 c896ea8 LMDB_0.9.16 5d67c6a"
    ];
    cy.request(route)
      .its("body")
      .then(runs => expect(getVersions(runs)).to.deep.equal(order));
  });
});
describe("/datasets.json", () => {
  it("returns JSON", () => {
    cy.request("/datasets.json")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });
  it("expected body", function() {
    cy.request("/datasets.json")
      .its("body")
      .should(body => expect(body).to.deep.eq(["v1", "v2"]));
  });
});
describe("/schema.json", () => {
  it("returns JSON", () => {
    cy.request("/schema.json")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });
});
