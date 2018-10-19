import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStory, downloadChapters, convertStory, getStoryResult } from '../actions/story';
var fileDownload = require('js-file-download');

class ViewStory extends Component {

    constructor(props) {
        super(props);
        this.state = {
          story_id: this.props.match.params.id,
          story_data: []
        };
        this.handleDownloadClick = this.handleDownloadClick.bind(this);
        this.handleConvertClick = this.handleConvertClick.bind(this);
        this.handleGetResultClick = this.handleGetResultClick.bind(this);
    }

    handleDownloadClick(e) {
        e.preventDefault();
        this.downloadStory();
    }

    handleConvertClick(e) {
        e.preventDefault();
        this.convertStory();
    }

    handleGetResultClick(e){
      e.preventDefault();
      this.getStoryResult(this.state.story_data["title"]);
    }

    componentDidMount() {
        this.getStoryData();
    }

    getStoryData(){
        this.props.getStory(this.state.story_id, function(result){
                this.setState({story_data: result});
        }.bind(this));
    }

    displayStoryData(story){
      let storyAttributeList = {
        "Title": "title",
        "URL" : "url",
        "Working?": "working",
        "Current Status": "current_status",
      }
      let metadataAttributeList = {
        "Genre(s)"   : "genre",
        "Author(s)"  : "author",
        "Other Name(s)": "other_name",
        "Translation Status"  : "status",
        "Year Released": "date_released",
        "Translator": "translator",
        "Views" : "views",
        "Bio"     : "bio"
      }
      var storyData = Object.keys(storyAttributeList).map((attribute) => this.displayStoryAttribute(storyAttributeList[attribute], attribute, story[storyAttributeList[attribute]]) );
      if(story["metadata"]){
        var metaData = Object.keys(metadataAttributeList).map((attribute) => this.displayStoryAttribute(metadataAttributeList[attribute], attribute, story["metadata"][metadataAttributeList[attribute]]));
        storyData = storyData.concat(metaData);
      }
      return storyData;
    }

    displayStoryAttribute(index, attribute, value){
      // Check for undisplayable attribute types
      if(typeof value !== "undefined"){
        if(typeof value === "boolean"){
          value = value ? "Yes" : "No";
        }
        else if(value.isArray || typeof value === "object"){
          value = value.join();
        }
      }
      
      return(
            <tr key={ index }>
                <td>{ attribute }</td>
                <td>{ value }</td>
            </tr>
        )
    }

    displayChapters(chapters){
      var result = [];
      result = chapters.map((chapter, index) => this.renderChapter("chapter"+index, chapter));
      return result;
    }

    renderChapter(index, chapter){
      return(
            <tr key={ index }>
                <td>{ chapter["title"] }</td>
            </tr>
        )
      //                <td>{ chapter["downloaded"] ? "Yes" : "No" }</td>
    }

    downloadStory(){
      console.log("Started Downloading");
      this.props.downloadChapters(this.state.story_id, function(result){
                console.log("Story Downloaded");
                console.log(result);
        });
    }

    convertStory(){
      console.log("Started Converting");
      this.props.convertStory(this.state.story_id, function(result){
                console.log("Story Converted");
                console.log(result);
        });
    }

    getStoryResult(title){
      console.log("Getting result");
      this.props.getStoryResult(this.state.story_id, function(result){
        fileDownload(result.data, title + '.mobi');
      });
    }

    render() {
      let storyData = this.state.story_data;
      let chapters = storyData.chapters;

      return(
        <div className="table-bordered" id="storyId">
          <table >
            <thead>
            </thead>
            <tbody>
              { this.displayStoryData(storyData) }
            </tbody>
          </table>
          <button onClick = { this.handleDownloadClick }>Download Story</button>
          <button onClick = { this.handleConvertClick }>Convert Story</button>
          <button onClick = { this.handleGetResultClick }>Get Converted Story</button>
          <table >
            <thead>
              <tr>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              { chapters ? this.displayChapters(chapters) : null }
            </tbody>
          </table>
        </div>
      )
      //<th>Downloaded?</th> 
    }
}
ViewStory.propTypes = {
    getStory: PropTypes.func.isRequired,
    downloadChapters: PropTypes.func.isRequired,
    convertStory: PropTypes.func.isRequired
    //auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { getStory, downloadChapters, convertStory, getStoryResult })(ViewStory);

