import React, { Component } from 'react';
import EachStar from './EachStar/EachStar';
import './StarRating.scss';

import { BASE_URL } from '../../../Config';

const checkUserWithCallbackFunc = callBackFunc => {
  if (localStorage.getItem('token')) {
    callBackFunc();
  } else {
    alert('로그인 해주세요');
  }
};

export default class StarRating extends Component {
  constructor() {
    super();
    this.state = {
      rateValue: [false, false, false, false, false],
      hoverRateValue: [false, false, false, false, false],
      isHover: false,
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem('token')) {
      fetch(`${BASE_URL}/ratings/products/${this.props.id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(res => res.json())
        .then(data => {
          const currentRateValue = Array(5)
            .fill(false)
            .fill(true, 0, data.result.rating);

          this.setState({
            rateValue: currentRateValue,
          });
        });
    }
  };

  handleStarClick = clickedIndex => {
    const prevRateValue = [...this.state.rateValue];
    const isClickedStarActive = prevRateValue[clickedIndex];
    const isNextStarActive = prevRateValue[clickedIndex + 1];

    if (isClickedStarActive && isNextStarActive) {
      prevRateValue.fill(false, clickedIndex + 1);
    } else if (isClickedStarActive) {
      prevRateValue.fill(false, 0, clickedIndex + 1);
    } else if (!isClickedStarActive) {
      prevRateValue.fill(true, 0, clickedIndex + 1);
    }

    const rating = prevRateValue.filter(value => value).length;

    const callback = () => {
      fetch(`${BASE_URL}/ratings/products/${this.props.id}`, {
        method: 'POST',
        body: JSON.stringify({
          rating: rating,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: localStorage.getItem('token'),
        },
      }).then(() => {
        const { callStarGraphApi, callEachDataApi, selectItem, idx } =
          this.props;

        if (callStarGraphApi) callStarGraphApi();
        if (callEachDataApi) callEachDataApi();
        if (selectItem) selectItem(idx);
      });

      this.setState({
        isHover: false,
        hoverRateValue: [false, false, false, false, false],
        rateValue: prevRateValue,
      });
    };

    checkUserWithCallbackFunc(callback);
  };

  handleStarMousehover = hoveredIndex => {
    const prevRateValue = [...this.state.hoverRateValue];
    const isClickedStarActive = prevRateValue[hoveredIndex];
    const isNextStarActive = prevRateValue[hoveredIndex + 1];

    if (isClickedStarActive && isNextStarActive) {
      prevRateValue.fill(false, hoveredIndex + 1);
    } else if (isClickedStarActive) {
      prevRateValue.fill(false, 0, hoveredIndex + 1);
    } else if (!isClickedStarActive) {
      prevRateValue.fill(true, 0, hoveredIndex + 1);
    }

    this.setState({
      isHover: true,
      hoverRateValue: prevRateValue,
    });
  };

  handleStarMouseout = () => {
    this.setState({
      isHover: false,
      hoverRateValue: [false, false, false, false, false],
    });
  };

  checkIsActive = star => {
    const { isHover, hoverRateValue, rateValue } = this.state;
    const isStarActive = rateValue[star];

    if (isHover) {
      return hoverRateValue[star] ? 'activeStar' : 'inactiveStar';
    }

    return isStarActive ? 'activeStar' : 'inactiveStar';
  };

  render() {
    const starArray = [0, 1, 2, 3, 4];

    return (
      <>
        <div className="starList">
          {starArray.map((star, index) => {
            return (
              <button
                key={index}
                onClick={() => this.handleStarClick(star)}
                onMouseEnter={() => this.handleStarMousehover(star)}
                onMouseLeave={() => this.handleStarMouseout()}
              >
                <EachStar
                  size={this.props.size}
                  name={this.checkIsActive(star)}
                />
              </button>
            );
          })}
        </div>
      </>
    );
  }
}
