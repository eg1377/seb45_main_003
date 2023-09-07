import { Link, useLocation } from "react-router-dom";
import { styled } from "styled-components";
import { COLOR } from "../../constants/color";
import { FONT_SIZE } from "../../constants/font";
import { AUCTION } from "../../constants/systemMessage";
import { formatTime } from "../../util/date";
import { ProductData } from "./List";

type ItemProps = {
  data: ProductData;
};

const StyledItem = styled.li`
  .title {
    padding: 1.5rem 1rem 1rem;
    border-bottom: 1px solid ${COLOR.border};

    h3 {
      margin: 0 0 0.5rem;
    }
  }

  .price {
    padding: 1rem;
    display: flex;
    flex-flow: column;
    gap: 0.75rem;

    .gray {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      align-items: center;
    }

    .price_number {
      color: ${COLOR.darkText};
      font-size: ${FONT_SIZE.font_20};
    }
  }

  .gray {
    color: ${COLOR.mediumText};
  }
`;

const ListItem = (props: ItemProps): JSX.Element => {
  const location = useLocation();
  const { data } = props;

  return (
    <StyledItem>
      <Link to={`${location.pathname}/${data.productId}`}>
        <div className="title">
          <h3>{data.title}</h3>
          <p className="gray">
            {data.auction
              ? data.productStatus === "BEFORE"
                ? formatTime(data.closedAt) + " 경매종료"
                : AUCTION.end
              : AUCTION.isnot}
          </p>
        </div>
        <div className="price">
          <p className="gray">
            <span>현재 입찰가</span>
            <span className="price_number">
              {data.auction ? data.currentAuctionPrice?.toLocaleString() : "-"}
            </span>
          </p>
          <p className="gray">
            <span>즉시 구매가</span>
            <span className="price_number">{data.immediatelyBuyPrice.toLocaleString()}</span>
          </p>
        </div>
      </Link>
    </StyledItem>
  );
};
export default ListItem;