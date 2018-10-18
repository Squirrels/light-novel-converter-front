import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStory, downloadChapters } from '../actions/story';

class ViewStory extends Component {

    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        // this.state = {stories: []}
        this.state = {
          story_id: this.props.match.params.id,
          story_data: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.downloadStory();
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
      console.log(story);
      let storyAttributeList = {
        "Title": "title",
        "URL" : "url",
        "Downloading?": "downloading"
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

      //var result = [];
      var storyData = Object.keys(storyAttributeList).map((attribute) => this.displayStoryAttribute(storyAttributeList[attribute], attribute, story[storyAttributeList[attribute]]) );
      if(story["metadata"]){
        //console.log(story["metadata"][metadataAttributeList[1]]);
        var metaData = Object.keys(metadataAttributeList).map((attribute) => this.displayStoryAttribute(metadataAttributeList[attribute], attribute, story["metadata"][metadataAttributeList[attribute]]));
        storyData = storyData.concat(metaData);
      }
      //result = storyData.;
      //var chapterData = [];
     
      return storyData;
      
      // var displayedValues = Object.keys(storyAttributeList).map(function(key, index) {
      //    let attributeName = storyAttributeList[key];
      //    return this.displayStoryAttribute(attributeName, story[attributeName]);
      // });

      //return displayedValues.map((attribute, index) =>  this.displayStoryAttribute(index, attribute, displayedValues[attribute]) );
      // return(
      //       <tr key={ story.id }>
      //           <td>{ 1 }</td>
      //           <td>{ story.updatedAt }</td>
      //       </tr>
      //   )
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
                <td>{ chapter["downloaded"] ? "Yes" : "No" }</td>
            </tr>
        )
    }

    downloadStory(){
      console.log("Started Downloading");
      this.props.downloadChapters(this.state.story_id, function(result){
                //this.setState({story_data: result});
                console.log("Story Downloaded");
                console.log(result);
        }.bind(this));
    }

    render() {
      // var storiesData = this.state.stories;
      //let storyId = this.state.story_id;
      // Check id
      let storyData = this.state.story_data;
      //console.log(this.props);
      let chapters = storyData.chapters;
      //To retrieve keys from data.content
      //var keys = Object.keys(storyData.content);
   
      //iterate through the keys to get the underlying values
      //var allEmps = keys.map((t) => storyData.content[t].map((e) => (<div><li>{e.id}-{e.name}-{e.Age}</li></div>)) );
 
      return(
        <div className="table-bordered" id="storyId">
          <table >
            <thead>
            </thead>
            <tbody>
              { this.displayStoryData(storyData) }
            </tbody>
          </table>
          <button onClick = { this.handleClick }>Download Story</button>
          <table >
            <thead>
              <tr>
                <th>Title</th>
                <th>Downloaded?</th> 
              </tr>
            </thead>
            <tbody>
              { chapters ? this.displayChapters(chapters) : null }
            </tbody>
          </table>
        </div>
      )
      //
      // const stories = (
      //       <table >
      //         <thead>
      //         <tr>
      //           <th></th>
      //           <th>Title</th>
      //           <th>Number of chapters</th> 
      //           <th>Last Updated</th>
      //         </tr>
      //         </thead>
      //         <tbody>
      //           {   storiesData.map((story, index) =>  <tr key={ story.id }><td>{index+1}</td><td><a href={"/story/" + story.id}>{story.title}</a></td><td>{story.chapters.length}</td><td>{story.updatedAt}</td></tr> )}
      //         </tbody>
      //       </table>
      //   );
      //   return(
      //       <div className="" id="storyList">
      //           <button onClick = {this.handleClick}>Refresh Stories</button>
      //           {stories}
      //       </div>
      //   )
    }
}
ViewStory.propTypes = {
    getStory: PropTypes.func.isRequired,
    downloadChapters: PropTypes.func.isRequired,
    //auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { getStory, downloadChapters })(ViewStory);

