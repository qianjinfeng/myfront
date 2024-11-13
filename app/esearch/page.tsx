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
import moment from "moment";


const connector = new ElasticsearchAPIConnector({
  host: "http://localhost:9200",
  index: "dicom",
  apiKey: "SHlxdzRwSUJITEdvSlBXeUFzZFA6aFkzYkRWTDVSMDY0cmdKU2U4am5mUQ=="
});

const config = {
  debug: true,
  searchQuery: {
    search_fields: {
      StudyDescription: {},
      name: {weight: 3}
    },
    result_fields: {
      name:{
        snippet: {
          size: 100,
          fallback: true
        }
      },
      StudyDescription:{
        raw: {}
      },
      StudyInstanceUID: {
        snippet: {}
      },
      StudyDate:{ raw:{}}
    },
    disjunctiveFacets: ["PatientSex", "StudyDate"],
    facets: {
      PatientSex: {type: "value"},
      StudyDate: {
        type: "range",
        ranges: [
          {
            from: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
            name: "Within the last 1 day"
          },
          {
            from: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
            to: moment().subtract(1, 'days').format('YYYY-MM-DD'),
            name: "Within the last 1 week"
          },
          {
            from: moment().subtract(1, 'months').format('YYYY-MM-DD'),
            to: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
            name: "Winthin the last 1 month"
          },
          {
            to: moment().subtract(1, 'months').format('YYYY-MM-DD'),
            name: "More than 1 month ago"
          }
        ]
      }
    }
  },
  autocompleteQuery: {
    // results: {
    //   resultsPerPage: 5,
    //   search_fields: {
    //     "name": {
    //       weight: 3
    //     }
    //   },
    //   result_fields: {
    //     name: {
    //       raw: {}
    //     }
    //   }
    // },
    suggestions: {
      types: {
        "documents": { fields: ["name.suggest"] }
      },
      size: 4
    }
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};

const SORT_OPTIONS = [
  // {
  //   name: "State -> Title",
  //   value: [
  //     {
  //       field: "states",
  //       direction: "asc"
  //     },
  //     {
  //       field: "title",
  //       direction: "asc"
  //     }
  //   ]
  // }
  {
    name: "Relevance",
    value: []
  },
  {
    name: "StudyDate",
    value: [
      {
        field: "StudyDate",
        direction: "desc"
      }
    ]
  }
];

const driver = new SearchDriver(config);

console.log(moment().subtract(1, 'days').format('YYYY-MM-DD'));

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
                    autocompleteMinimumCharacters={2}
                    // autocompleteResults={{
                    //   linkTarget: "_blank",
                    //   sectionTitle: "Results",
                    //   titleField: "name",
                    //   urlField: "StudyInstanceUID",
                    //   shouldTrackClickThrough: true
                    // }}
                    autocompleteSuggestions={{sectionTitle: "Suggested Queries"}}
                    debounceLength={200}
                  />
                }
                sideContent={
                  <div>
                    {wasSearched && <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS}/>}
                    <Facet field={"PatientSex"} label={"Sex"} />
                    <Facet 
                        field={"StudyDate"}
                        label="Date Established"
                      />
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
