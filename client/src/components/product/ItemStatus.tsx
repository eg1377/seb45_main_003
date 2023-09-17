import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Webstomp, { Client } from "webstomp-client";
import { ReactComponent as ViewsIcon } from "../../assets/images/Views.svg";
import { loginState } from "../../atoms/atoms";
import { COLOR } from "../../constants/color";
import { FONT_SIZE } from "../../constants/font";
import { getUserId } from "../../util/auth";
import { formatTime } from "../../util/date";
import { plus5Percent } from "../../util/number";
import Button from "../common/Button";
import ProductStatus from "../common/ProductStatus";
import { CustomSwiperProps } from "../mainPage/carousel/Carousel";
import { ProductData } from "../productList/List";
import Bid from "./Bid";
import BuyNow from "./BuyNow";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import WishCount from "./WishCount";

type ItemStatusProps = {
  data: ProductData;
};

const StyledItemStatus = styled.section`
  box-sizing: border-box;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${COLOR.border};
  border-radius: 6px;
  gap: 3rem;
  overflow: hidden;

  .custom_swiper.swiper {
    max-width: 40rem;
    width: 50% !important;
    margin: 0;
  }

  .item_status {
    padding: 1.5rem 1.5rem 1.5rem 0;
    max-width: 27.5rem;
    width: 40%;

    & > div:not(:first-child, .date_or_status, .chatting_link, .result) {
      padding: 1.5rem 0;
      border-top: 1px solid ${COLOR.border};
    }

    .title {
      display: flex;
      flex-flow: column;
      gap: 0.5rem;
    }

    .icon_box {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;

      & > div {
        gap: 0.25rem;
      }
    }
  }

  .auction {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }

  .price,
  .time {
    display: flex;
    flex-flow: row;
    gap: 2rem;

    & > span:first-child {
      width: 6.25rem;
    }
  }

  .add_wishlist,
  .current_price,
  .create_at,
  .buy_it_now_price,
  .result {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;

    h4 {
      font-size: ${FONT_SIZE.font_20};
      font-weight: 600;
    }

    &.buy_it_now_price .price_number {
      font-weight: 600;
    }
  }

  .chatting_link {
    padding: 1.5rem 1rem;
    border: 1px solid ${COLOR.border};
    border-radius: 6px;

    h4 {
      font-size: 1.25rem;
      margin: 0 0 0.25rem;
    }

    p {
      margin: 0 0 0.9375rem;
    }

    button {
      width: 100%;
      padding: 0.75rem 0;
    }

    & + div {
      border-top: none !important;
    }
  }

  img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    vertical-align: top;
  }

  .gray {
    color: ${COLOR.mediumText};
    display: flex;
    align-items: center;

    svg path {
      fill: ${COLOR.mediumText} !important;
    }
  }

  .date_or_status {
    margin: 1rem 0;
    font-size: ${FONT_SIZE.font_18};
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    span {
      margin: 0;
    }
  }

  .wishlist_box {
    display: flex;
    flex-flow: row;
    gap: 1rem;
  }

  .icon_box {
    display: flex;
    gap: 0.25rem;
  }

  .delete_icon {
    margin: 0 0 0 -0.25rem;
    cursor: pointer;
    justify-content: center;
  }

  .error_message {
    font-size: ${FONT_SIZE.font_16};
    font-weight: 400;
  }

  @media (max-width: 30rem) {
    .current_price,
    .buy_it_now_price {
      flex-flow: column;
      align-items: flex-start;
      gap: 1rem;

      button {
        width: 100%;
      }
    }
  }

  @media (max-width: 64rem) {
    flex-flow: column;
    gap: 1.5rem;

    .custom_swiper.swiper {
      max-width: 40rem;
      width: 100% !important;
    }

    .item_status {
      max-width: 40rem;
      width: 100%;
      box-sizing: border-box;
      padding: 01rem;
    }

    .price,
    .time {
      gap: 0.75rem;

      & > span:first-child {
        width: unset;
      }
    }
  }
`;

const ItemStatus = ({ data }: ItemStatusProps) => {
  const navigate = useNavigate();
  const isLogin = useRecoilValue(loginState);
  const userid = getUserId();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const queryClient = useQueryClient();
  const location = useLocation();
  const idArr = location.pathname.split("/");
  const productId = idArr[idArr.length - 1];

  useEffect(() => {
    //소켓 연결
    if (data) {
      const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL as string);
      const stomp = Webstomp.over(socket);

      stomp.connect({}, () => {
        setStompClient(stomp);
      });

      return () => {
        stomp.disconnect(() => {});
      };
    }
  }, []);

  //소켓 구독
  useEffect(() => {
    if (stompClient && data) {
      stompClient.subscribe(`/topic/bid/${data.productId}`, (message) => {
        const socketData = JSON.parse(message.body).body;

        const modifiedData = {
          ...data,
          buyerId: socketData.buyerId,
          currentAuctionPrice: socketData.currentAuctionPrice,
          minBidPrice: plus5Percent(socketData.currentAuctionPrice),
        };

        queryClient.setQueryData(["productData", productId], modifiedData);
      });
    }
  }, [stompClient, data]);

  //슬라이드 관련 설정
  SwiperCore.use([Pagination]);

  const swiperProps: CustomSwiperProps = {
    pagination: {
      clickable: true,
    },
  };

  return (
    <>
      <StyledItemStatus>
        <Swiper {...swiperProps} className="custom_swiper">
          {data.images.map((image) => {
            return (
              <SwiperSlide key={image.imageId}>
                <img src={image.path} alt="" />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="item_status">
          <div className="title">
            <h1>{data.title}</h1>
            <div className="icon_box">
              {isLogin && Number(userid) === data.memberId && (
                <div className="gray">
                  <EditButton data={data} />
                  <DeleteButton data={data} />
                </div>
              )}
              <div className="gray">
                <ViewsIcon />
                <span>{data.views}</span>
              </div>
            </div>
          </div>
          <div className="gray date_or_status">
            <ProductStatus data={data} />
          </div>

          {Number(userid) === data.buyerId && data.productStatus === "TRADE" && (
            <div className="chatting_link">
              <h4>{data.auction ? "상품 낙찰" : "구매 완료"}</h4>
              <p>판매자에게 연락하여 상품을 수령하세요.</p>
              <Button
                onClick={() => {
                  navigate(`/chat/${data.memberId}`);
                }}
                $design="yellow"
                type="button"
                $text="채팅하러 가기"
              />
            </div>
          )}
          <div className="add_wishlist">
            <WishCount isLogin={isLogin} data={data} />
          </div>
          {data.auction && (
            <div className="auction">
              <div className="current_price">
                <div className="price">
                  <span>현재 입찰가</span>
                  <span className="price_number">
                    {data.currentAuctionPrice?.toLocaleString() + "원"}
                  </span>
                </div>
                {isLogin && Number(userid) !== data.memberId && data.productStatus === "BEFORE" && (
                  <Bid data={data} stompClient={stompClient} />
                )}
              </div>
              <div className="create_at">
                <div className="time">
                  <span className="gray">경매 시작 시간</span>
                  <span className="price_number  gray">{formatTime(data.createdAt)}</span>
                </div>
              </div>
              {/* <div className="price">
              <span className="gray">시작가</span>
              <span className="price_number  gray">
                {data.auction ? data.currentAuctionPrice : "-"}
              </span>
            </div> */}
            </div>
          )}
          <BuyNow data={data} />

          {data.productStatus !== "BEFORE" && (
            <div className="result">
              <div className="price">
                <span className="price_number_title gray">최종 거래가</span>
                <span className="price_number">
                  {data?.currentAuctionPrice && data.currentAuctionPrice < data.immediatelyBuyPrice
                    ? data.currentAuctionPrice.toLocaleString() + "원"
                    : data.immediatelyBuyPrice.toLocaleString() + "원"}
                </span>
              </div>
            </div>
          )}
        </div>
      </StyledItemStatus>
    </>
  );
};

export default ItemStatus;