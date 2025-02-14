import React from 'react';
import styled from 'styled-components';

function Category() {
  return (
    <StCategoriesSection>
      <div className="one">One</div>
      <div className="two">Two</div>
      <div className="three">Three</div>
      <div className="four">Four</div>
      <div className="five">Five</div>
      <div className="six">Six</div>
      <div className="seven">Seven</div>
      <div className="eigth">Eight</div>
      <div className="nine">Nine</div>
      <div className="ten">Ten</div>
    </StCategoriesSection>
  );
}

export default Category;
const StCategoriesSection = styled.section`
  width: 50vw;
  height: 90vh;
  margin: 0 auto;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3px;
  grid-auto-rows: minmax(100px, auto);

  div {
    border: solid 2px black;
    border-radius: 14px;
  }

  .two {
    grid-column: 2 / 4;
    grid-row: 1 / 3;
  }
  .three {
    grid-column: 1;
    grid-row: 2 / 5;
  }
  .four {
    grid-column: 2;
    grid-row: 3;
  }
  .five {
    grid-column: 3;
    grid-row: 3;
  }
  .six {
    grid-column: 2;
    grid-row: 4/6;
  }

  .ten {
    grid-column: 1/4;
    grid-row: 6;
  }
`;
