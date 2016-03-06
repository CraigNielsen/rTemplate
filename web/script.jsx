String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

var ListContainer = React.createClass({
  render: function() {
    return (
      <div >
        <TitleForFeed heading={this.props.heading} />
        <hr/>
        {this.props.children}
      </div>
    );
  }
});

var TitleForFeed = React.createClass({
  render: function() {
    return (
      <div className="column">
        <div>
          <div className="text-center">
            <div className="iline h1">
              {this.props.heading}
            </div>
          </div>
        </div>
      </div>
    );
  }
})

var FeedContainer = React.createClass({
  mixins: [ReactFireMixin],
  render: function() {
    var feedNodes = this.props.items.map(function(feedNode) {
      return (
        <FeedItem_Collection
          key={feedNode.timestamp}
          info={feedNode}/>
      );
    })
    return (
      <div className="">
        {feedNodes.reverse()}
      </div>
    );
  }
})

var Stats = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState : function() {
    return {data: [], "ddd" : 0 , "week" : 0 , "month" : 0 , "allTime" : 0};
  },
  componentWillMount: function() {
    var ref_day = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/today");
    var ref_week = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/thisWeek");
    var ref_month = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/thisMonth");
    var ref_all = new Firebase("https://ifixgroup.firebaseio.com/collections-stats/allTime");

    this.bindAsObject(ref_day, "ddd");
    this.bindAsObject(ref_week, "week");
    this.bindAsObject(ref_month, "month");
    this.bindAsObject(ref_all, "allTime");
    ref_day.on('child_changed', function(snap) {
      $('.joggle').transition('jiggle');
    });
  },
  render: function() {
    var now = moment().format('MMMM');
    return (
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui statistics">
            <div className="statistic">
              <div className="value">
                <div className="joggle">
                  {parseInt(this.state.ddd.count).toLocaleString()}
                </div>
              </div>
              <div className="label">Today</div>
            </div>
          </div>
        </div>
        <div className="four wide column">
          <div className= "ui statistics">
            <div className="statistic">
              <div className="value">
              <div className="joggle">
                {parseInt(this.state.week.count).toLocaleString()}
              </div>
            </div>
              <div className="label">
                This Week
              </div>
            </div>
          </div>
        </div>
        <div className="four wide column">
          <div className="ui statistics">
            <div className="statistic">
              <div className="value">
              <div className="joggle">
                {parseInt(this.state.month.count).toLocaleString()}
              </div>
            </div>
              <div className="label">
                This Month
              </div>
            </div>
          </div>
        </div>
        <div className="four wide column">
          <div className= "ui statistics">
            <div className="statistic">
              <div className="value">
              <div className="joggle">
                {parseInt(this.state.allTime.count).toLocaleString()}
              </div>
            </div>
              <div className="label">
                Since 2007
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

var FeedItem_Collection = React.createClass({
  render: function() {
    var elementClass = classNames ({
      'lead':true,
      'lineElement': true
    });
    var inline = {
      width: '1em',
      paddingBottom: 10
    };
    return (

      <div className="ui grid">
        <div className="four wide column">
        </div>
        <div className="twelve wide column">
          <div className="ui items">
            <div className="item">
              <div className="ui tiny circular image">
                <img
                  src={"./images/store.jpg" } />
              </div>
              <div className="content">
                <span className="header">
                  {" " + this.props.info.branch.capitalizeFirstLetter()}
                </span>
                <div className="meta">
                  {this.props.info.repair}
                </div>
                <div className="description">
                  <p>
                  </p>
                </div>
                <div className="extra">
                  <span className="text-muted">
                    {moment(this.props.info.timestamp).fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="row">
                <span className="">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
})



var MyApp = React.createClass({
  mixins: [ReactFireMixin],
  componentDidMount: function() {
    this.interval = setInterval(this.update, 10000);
  },
  componentWillMount: function() {
    var ref = new Firebase("");
    ref = ref.orderByChild('timestamp').limitToLast(20);
    this.bindAsArray(ref, "collections");
  },
  update: function() {
    this.setState({date: new Date()});
  },
  getInitialState: function() {
    return {date: new Date()};
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (

      <div className="container">
        <div >
          <img
            className="ui small rounded image"
            src={"./images/ifix.png" } />
        </div>
        <ListContainer
          heading="Repairs"
          updatedOn={this.state.date}>
          <Stats updatedOn={this.state.date} />
        </ListContainer>
        <div className="ui two column very relaxed  grid">
          <div className="column">
            <ListContainer
              heading={"Live Feed"}
              updatedOn={this.state.date}>
              <FeedContainer items={this.state.collections}/>
            </ListContainer>
          </div>
        </div>
      </div>
    )
  }
})
ReactDOM.render(
  <MyApp />,
  document.getElementById('main')
);
