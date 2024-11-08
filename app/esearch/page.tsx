'use client'

import React from "react";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchDriver } from "@elastic/search-ui";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";


const connector = new ElasticsearchAPIConnector({
  host: "http://localhost:9200",
  index: "dicom",
  apiKey: "SHlxdzRwSUJITEdvSlBXeUFzZFA6aFkzYkRWTDVSMDY0cmdKU2U4am5mUQ=="
});

const config = {
  searchQuery: {
    search_fields: {
      StudyDescription: {},
      name: {},
      AccessionNumber: {}
    },
    result_fields: {
      name:{
        raw: {}
      },
      StudyDescription:{
        raw: {}
      },
      StudyInstanceUID: {
        snippet: {}
      }
    },
    disjunctiveFacets: ["PatientSex"],
    facets: {
      "PatientSex": {type: "value"}
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        "name": {
          weight: 3
        }
      },
      result_fields: {
        name: {
          snippet: {
            size: 100,
            fallback: true
          }
        },
        StudyInstanceUID: {
          raw: {}
        }
      }
    },
    suggestions: {
      types: {
        results: { fields: ["name"] }
      },
      size: 4
    }
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};

const driver = new SearchDriver(config);

driver.subscribeToStateChanges((state) =>
  console.log(`Received ${state.totalResults} results for your search!`)
);

export default function Home() {
  return (
    <SearchProvider config={config}>
    <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
      {({ wasSearched }) => {
        return (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={
                  <SearchBox
                    autocompleteMinimumCharacters={3}
                    autocompleteResults={{
                      linkTarget: "_blank",
                      sectionTitle: "Results",
                      titleField: "name",
                      urlField: "StudyInstanceUID",
                      shouldTrackClickThrough: true
                    }}
                    autocompleteSuggestions={true}
                    debounceLength={0}
                  />
                }
                sideContent={
                  <div>
                    {wasSearched && <Sorting label={"Sort by"} sortOptions={[]} />}
                    <Facet key={"1"} field={"PatientSex"} label={"Sex"} />
                  </div>
                }
                bodyContent={<Results shouldTrackClickThrough={true} />}
                bodyHeader={
                  <React.Fragment>
                    {wasSearched && <PagingInfo />}
                    {wasSearched && <ResultsPerPage />}
                  </React.Fragment>
                }
                bodyFooter={<Paging />}
              />
            </ErrorBoundary>
          </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
