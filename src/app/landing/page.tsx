import { HeartIcon, LinkIcon, RocketIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  // Feature cards data
  const featureCards = [
    {
      id: 1,
      title: "Fast & Smooth Transactions",
      description:
        "Solana's speed means no waiting around, transactions happen in the blink of an eye.",
      icon: <RocketIcon className="w-10 h-10" />,
      highlightColor: "bg-[#03abff]",
      shadowColor: "shadow-[0px_9px_27px_2px_#03abff80]",
    },
    {
      id: 2,
      title: "Earn & Grow",
      description:
        "Every like, comment, and share earns you Seeds which is important for greater visibility in the Web3 content economy.",
      icon: <HeartIcon className="w-10 h-10" />,
      highlightColor: "bg-[#4cde86]",
      shadowColor: "shadow-[0px_14px_27.1px_2px_#4cde8680]",
    },
    {
      id: 3,
      title: "Wallet Integration",
      description:
        "Seamless sign-ins with Solflare, Phantom, or even your email—your call!",
      icon: <LinkIcon className="w-10 h-10" />,
      highlightColor: "bg-[#7984ff]",
      shadowColor: "shadow-[0px_9px_27px_2px_#7985ff80]",
    },
  ];

  // Content cards data
  const contentCards = [
    {
      id: 1,
      title: "Task/Article Title here",
      description: "Task description goes here.",
      image: "/rectangle-3.png",
      avatar: "/ellipse-6.png",
      likes: "1.5k",
      comments: "10k",
      shares: "120",
      reward: "100 $CLS",
      rewardIcon: "/group-261.png",
    },
    {
      id: 2,
      title: "Task/Article Title here",
      description: "Task description goes here.",
      image: "/rectangle-3-1.png",
      avatar: "/ellipse-6-1.png",
      likes: "1.5k",
      comments: "10k",
      shares: "120",
      reward: "100 $CLS",
      rewardIcon: "/group-261-1.png",
    },
    {
      id: 3,
      title: "Task/Article Title here",
      description: "Task description goes here.",
      image: "/rectangle-3-2.png",
      avatar: "/ellipse-6-2.png",
      likes: "1.5k",
      comments: "10k",
      shares: "120",
      reward: "100 $CLS",
      rewardIcon: "/group-261-2.png",
    },
  ];

  return (
    <div className="bg-[#161616] flex flex-row justify-center w-full">
      <div className="bg-[#161616] overflow-hidden w-full max-w-[1512px] relative">
        {/* Hero Section */}
        <header className="relative w-full h-[1028px]">
          {/* Background Effects */}
          <div className="absolute w-[593px] h-[557px] top-[266px] right-[337px] bg-[#0d1a33] rounded-[296.68px/278.39px] blur-[70.4px]" />
          <div className="absolute w-[426px] h-[948px] top-[126px] right-[274px] rounded-[213.15px/473.97px] rotate-[-58.79deg] blur-[75.05px] bg-[linear-gradient(94deg,rgba(3,171,255,0.2)_26%,rgba(45,184,101,0.2)_61%,rgba(93,63,209,0.2)_100%)]" />

          {/* Navigation Bar */}
          <nav className="flex w-full h-[134px] items-end justify-between px-[114px] py-[23px] absolute top-0 left-0 bg-[#16161633] backdrop-blur-[15.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(15.5px)_brightness(100%)] z-10">
            <img
              className="relative w-[207.95px] h-[48.32px]"
              alt="Creatorslab Logo"
              src="/group-2.png"
            />
            <Button className="w-[140px] h-[50px] bg-[linear-gradient(128deg,rgba(93,63,209,1)_18%,rgba(3,171,255,1)_100%)] hover:opacity-90">
              Get Started
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="flex flex-col w-[662px] items-start gap-5 absolute top-[403px] left-[114px] z-10">
            <div className="flex flex-col items-start gap-[17px] relative self-stretch w-full">
              <h1 className="text-white text-5xl font-extrabold font-['Syne',Helvetica]">
                Empowering Global Creativity with{" "}
                <span className="text-[#03abff]">Web3</span>
              </h1>
              <p className="relative w-[638px] font-['Inter',Helvetica] font-semibold text-[#777777] text-base">
                Take control of your growth. Join the next evolution of content
                creation and secure exclusive early access.
              </p>
            </div>
            <Button className="w-44 h-[50px] bg-[linear-gradient(128deg,rgba(93,63,209,1)_18%,rgba(3,171,255,1)_100%)] hover:opacity-90">
              Get Started
            </Button>
          </div>

          {/* Hero Images */}
          <div className="absolute w-[621px] h-[575px] top-64 right-[337px]">
            <div className="relative w-[557px] h-[575px]">
              <img
                className="w-[347px] h-[416px] top-[159px] left-[210px] absolute object-cover"
                alt="CLS token"
                src="/cls-token-2.png"
              />
              <img
                className="w-[437px] h-[461px] top-[39px] left-[102px] absolute object-cover"
                alt="CLS token"
                src="/cls-token-2.png"
              />
              <img
                className="w-[361px] h-[414px] top-0 left-0 absolute object-cover"
                alt="CLS token"
                src="/cls-token-2.png"
              />
            </div>
          </div>
        </header>

        {/* Solana Blockchain Section */}
        <section className="relative w-full mt-[100px] mb-[100px]">
          <img
            className="absolute w-[798px] h-[897px] left-0"
            alt="Background ellipse"
            src="/ellipse-47.svg"
          />

          <div className="flex flex-col items-center relative z-10">
            <h2 className="w-[1071px] font-['Syne',Helvetica] font-extrabold text-white text-5xl text-center mb-10">
              Built on the lightning-fast, low-fee Solana blockchain
            </h2>

            <p className="w-[698px] font-['Inter',Helvetica] font-medium text-[#cccdce] text-base text-center mb-16">
              Creators Lab is backed by our powerhouse partners Solana
              Foundation and SuperteamNG. Together, we're crafting a digital
              playground where creators rule.
            </p>

            {/* Feature Cards */}
            <div className="flex justify-center gap-10 w-full">
              {featureCards.map((card) => (
                <div key={card.id} className="flex flex-col items-center">
                  <div
                    className={`relative w-[106.74px] h-1 ${card.highlightColor} rounded-[4px_4px_0px_0px] ${card.shadowColor}`}
                  />
                  <Card className="w-[371px] h-[268px] bg-[#ffffff0d] rounded-[20px] border border-solid border-[#3e3e3e]">
                    <CardContent className="flex flex-col items-center justify-center gap-[17px] p-7 h-full">
                      {card.icon}
                      <div className="flex flex-col items-center gap-3 w-full">
                        <h3 className="font-['Inter',Helvetica] font-bold text-white text-xl text-center">
                          {card.title}
                        </h3>
                        <p className="font-['Inter',Helvetica] font-medium text-[#cccdce] text-sm text-center leading-[27.2px]">
                          {card.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join the Fun Section */}
        <section className="relative w-full px-28 mt-20">
          <img
            className="absolute w-[869px] h-[947px] top-0 right-[107px]"
            alt="Background ellipse"
            src="/ellipse-49.svg"
          />

          <div className="flex w-full items-center justify-between mb-10 relative z-10">
            <div className="flex flex-col w-[504.31px] items-start gap-3">
              <h2 className="font-['Syne',Helvetica] font-extrabold text-white text-5xl">
                Join the Fun
              </h2>
              <p className="font-['Inter',Helvetica] font-medium text-[#cccdce] text-base">
                This is your moment. Jump into the Web3 revolution and make your
                mark.
              </p>
            </div>
            <Button className="w-44 h-[50px] bg-[linear-gradient(128deg,rgba(93,63,209,1)_18%,rgba(3,171,255,1)_100%)] hover:opacity-90">
              Get Started
            </Button>
          </div>

          {/* Content Cards Section */}
          <div className="flex flex-col w-full gap-5 relative z-10">
            <div className="flex items-center justify-between w-full">
              <h3 className="font-['Inter',Helvetica] font-semibold text-white text-base">
                Engage
              </h3>
              <div className="inline-flex items-center gap-5">
                <button className="font-['Inter',Helvetica] font-medium text-[#dfdfdf] text-sm underline">
                  Show all (20)
                </button>
                <div className="inline-flex items-center gap-2">
                  <button aria-label="Previous">
                    <img
                      className="w-9 h-9"
                      alt="Previous"
                      src="/solar-arrow-right-broken.svg"
                    />
                  </button>
                  <button aria-label="Next">
                    <img
                      className="w-9 h-9"
                      alt="Next"
                      src="/solar-arrow-right-broken-1.svg"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Cards Carousel */}
            <div className="w-full overflow-x-auto">
              <div className="flex gap-8 min-w-max">
                {contentCards.map((card) => (
                  <Card
                    key={card.id}
                    className="w-[458px] bg-[#161616] rounded-xl border-[0.5px] border-solid border-[#3e3e3e]"
                  >
                    <CardContent className="flex flex-col gap-2 p-[18px]">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <img
                            className="w-full h-[177.02px] object-cover rounded-lg"
                            alt={card.title}
                            src={card.image}
                          />
                          <img
                            className="absolute -bottom-7 right-0 w-[47.45px] h-[47.45px] object-cover rounded-full"
                            alt="User avatar"
                            src={card.avatar}
                          />
                        </div>
                        <h4 className="font-['Syne',Helvetica] font-bold text-white text-2xl mt-2">
                          {card.title}
                        </h4>
                      </div>
                      <p className="font-['Inter',Helvetica] font-normal text-[#777777] text-sm">
                        {card.description}
                      </p>
                      <div className="flex items-start gap-4 mt-1">
                        <div className="flex items-center justify-center gap-1 bg-[#5d3fd1] rounded-lg px-3 py-1.5">
                          <span className="font-['Inter',Helvetica] font-normal text-white text-sm">
                            {card.reward}
                          </span>
                          <img
                            className="w-3.5 h-3.5"
                            alt="Reward icon"
                            src={card.rewardIcon}
                          />
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center gap-1 bg-[#222222] rounded-lg px-2 py-1.5">
                            <img
                              className="w-5 h-5"
                              alt="Like icon"
                              src="/icon-park-solid-like.svg"
                            />
                            <span className="font-['Inter',Helvetica] font-normal text-white text-sm">
                              {card.likes}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-1 bg-[#222222] rounded-lg px-2 py-1.5">
                            <img
                              className="w-5 h-5"
                              alt="Comment icon"
                              src="/iconamoon-comment-fill.svg"
                            />
                            <span className="font-['Inter',Helvetica] font-normal text-white text-sm">
                              {card.comments}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-1 bg-[#222222] rounded-lg px-2 py-1.5">
                            <img
                              className="w-5 h-5"
                              alt="Share icon"
                              src="/mdi-share.svg"
                            />
                            <span className="font-['Inter',Helvetica] font-normal text-white text-sm">
                              {card.shares}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Promotional Banner */}
          <Card
            className="w-full mt-16 mb-16 border-[0.5px] border-solid border-[#3e3e3e] rounded-xl overflow-hidden relative z-10"
            style={{
              backgroundImage: "url(/frame-44.png)",
              backgroundSize: "cover",
            }}
          >
            <CardContent className="flex items-center justify-between p-7">
              <div className="flex flex-col gap-4 max-w-[637px]">
                <h3 className="font-['Syne',Helvetica] font-bold text-white text-2xl">
                  Earn, Engage and Expand with Creatorslab.
                </h3>
                <p className="font-['Inter',Helvetica] font-medium text-[#fbfbfb] text-sm">
                  We are building more than just a platform, we're creating a
                  decentralized social network where builders and content
                  creators thrive. <br />
                  <br />
                  Expand your reach, grow your influence, and connect with a
                  global Web3 community that values engagement.
                </p>
                <Button
                  variant="outline"
                  className="w-[151px] h-10 bg-[#ffffff26] text-white border-none hover:bg-[#ffffff40]"
                >
                  Become a member
                </Button>
              </div>
              <div className="relative w-[157.19px] h-[226.73px]">
                <div className="absolute w-[157px] h-[164px] top-[63px] left-0">
                  <div className="absolute w-[157px] h-[164px] top-0 left-0">
                    <img
                      className="absolute w-[123px] h-[164px] top-0 left-[34px] object-cover"
                      alt="Gold money bag"
                      src="/3d-mini-gold-money-bag-1.png"
                    />
                    <div className="absolute w-[27px] h-8 top-[5px] left-[7px] rotate-[-38.35deg]">
                      <div className="relative w-[59px] h-[59px] top-[-13px] -left-4">
                        <img
                          className="w-[41px] h-[42px] top-2 left-[9px] rotate-[38.35deg] absolute object-cover"
                          alt="Dollar coin"
                          src="/3d-business-side-view-dollar-coin-2-3.png"
                        />
                        <img
                          className="absolute w-[41px] h-[42px] top-2 left-[9px] rotate-[38.35deg] bg-blend-multiply object-cover"
                          alt="Dollar coin"
                          src="/3d-business-side-view-dollar-coin-2-3.png"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute w-[21px] h-[25px] top-[63px] left-[11px] bg-[url(/3d-business-side-view-dollar-coin-2-3.png)] bg-cover bg-[50%_50%]">
                    <img
                      className="w-[21px] h-[25px] top-0 left-0 bg-blend-multiply absolute object-cover"
                      alt="Dollar coin"
                      src="/3d-business-side-view-dollar-coin-2-3.png"
                    />
                  </div>
                </div>
                <div className="absolute w-[21px] h-[25px] top-[38px] left-[41px] bg-[url(/3d-business-side-view-dollar-coin-2-3.png)] bg-cover bg-[50%_50%]">
                  <img
                    className="w-[21px] h-[25px] top-0 left-0 bg-blend-multiply absolute object-cover"
                    alt="Dollar coin"
                    src="/3d-business-side-view-dollar-coin-2-3.png"
                  />
                </div>
                <div className="absolute w-[21px] h-[25px] top-0 left-[79px] bg-[url(/3d-business-side-view-dollar-coin-2-3.png)] bg-cover bg-[50%_50%]">
                  <img
                    className="w-[21px] h-[25px] top-0 left-0 bg-blend-multiply absolute object-cover"
                    alt="Dollar coin"
                    src="/3d-business-side-view-dollar-coin-2-3.png"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center mt-20 mb-10">
          <p className="font-['Inter',Helvetica] font-semibold text-[#fbfbfb] text-sm mb-4">
            Powered by
          </p>
          <div className="flex items-center gap-[23px] mb-10">
            <img
              className="w-[34.34px] h-[27.92px]"
              alt="Solana logo"
              src="/group.png"
            />
            <img
              className="w-[38px] h-[38px]"
              alt="Superteam logo"
              src="/superteam-logo-png-white-v1-3.png"
            />
          </div>
          <p className="font-['Inter',Helvetica] font-medium text-[#5f5f5f] text-base">
            Copyright 2024
          </p>
        </footer>
      </div>
    </div>
  );
};
