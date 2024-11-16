'use client'

import React from "react";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchDriver, SearchResult } from "@elastic/search-ui";
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

import { Filtering, Showing } from './Sider';



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
      title: {weight: 3}
    },
    result_fields: {
      title:{
        raw:{}
      },
      StudyDescription:{
        raw: {}
      },
      StudyInstanceUID: {
        snippet: {
          size: 100,
          fallback: true
        }
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
        "documents": { fields: ["title.suggest"] }
      },
      size: 4
    }
  },
  initialState: {
    resultsPerPage: 25
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};

const SORT_OPTIONS = [
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

const CustomResultView = ({ result, onClickLink}: {
  result: SearchResult,
  onClickLink: () => void
})=> (
  <li className="sui-result">
    <div className="sui-result__header">
      <h3>
        {/* Maintain onClickLink to correct track click throughs for analytics*/}
        <a onClick={onClickLink} href="http://localhost:3000/viewer?StudyInstanceUIDs=1.2.826.0.1.3680043.2.1125.1.11608962641993666019702920539307840">
          {result.title.raw}
        </a>
      </h3>
    </div>
    <div className="sui-result__body">
      {/* use 'raw' values of fields to access values without snippets */}
      <div className="sui-result__details">
        <p>{result.StudyDescription.raw} </p>
        <p>{result.StudyInstanceUID.snippet} </p>
      </div>
    </div>
  </li>
);

// const driver = new SearchDriver(config);

// console.log(moment().subtract(1, 'days').format('YYYY-MM-DD'));

// driver.subscribeToStateChanges((state) =>
//   console.log(`Received ${state.totalResults} results for your search!`)
// );

export default function Home() {
  return (
    <SearchProvider config={config}>
              <Layout
                header={
                  // <SearchBox
                  //   autocompleteMinimumCharacters={2}
                  //   // autocompleteResults={{
                  //   //   linkTarget: "_blank",
                  //   //   sectionTitle: "Results",
                  //   //   titleField: "name",
                  //   //   urlField: "StudyInstanceUID",
                  //   //   shouldTrackClickThrough: true
                  //   // }}
                  //   autocompleteSuggestions={{sectionTitle: "Suggested Queries"}}
                  //   debounceLength={200}
                  // />

                  <SearchBox
                  autocompleteSuggestions={true}
                  inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
                    <>
                      <div>
                        <input {...getInputProps({ placeholder: 'Search games' })} />
                        {getAutocomplete()}
                      </div>
                      <button {...getButtonProps()}>
                        <svg viewBox="0 0 250 250" width="20" height="20" role="img">
                          <title>Search</title>
                          <path d="M244.186 214.604l-54.379-54.378c-.289-.289-.628-.491-.93-.76 10.7-16.231 16.945-35.66 16.945-56.554C205.822 46.075 159.747 0 102.911 0S0 46.075 0 102.911c0 56.835 46.074 102.911 102.91 102.911 20.895 0 40.323-6.245 56.554-16.945.269.301.47.64.759.929l54.38 54.38c8.169 8.168 21.413 8.168 29.583 0 8.168-8.169 8.168-21.413 0-29.582zm-141.275-44.458c-37.134 0-67.236-30.102-67.236-67.235 0-37.134 30.103-67.236 67.236-67.236 37.132 0 67.235 30.103 67.235 67.236s-30.103 67.235-67.235 67.235z" />
                        </svg>
                      </button>
                    </>
                  )}
                />
                  
                }
                sideContent={
                  // <div>
                  //   {wasSearched && <Sorting label={"Sort by"} sortOptions={SORT_OPTIONS}/>}
                  //   <Facet field={"PatientSex"} label={"Sex"} />
                  //   <Facet 
                  //       field={"StudyDate"}
                  //       label="Date Established"
                  //     />
                  // </div>

                  <Filtering />
                }
                bodyContent={<Results resultView={CustomResultView} shouldTrackClickThrough={true} />}
                bodyHeader={
                  // <React.Fragment>
                  //   {wasSearched && <PagingInfo />}

                  //   {wasSearched && <ResultsPerPage />}
                  // </React.Fragment>
                  <Showing />
                }
                bodyFooter={<Paging />}
              />
    </SearchProvider>
  );
}
