// components/JobResponsibility.jsx
import { Brain, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const bgImage = '/wavesbg.jpg';

const JobResponsibility = () => {
    return (
      <div className="w-full relative -mt-[8rem] z-50">
        {/* Background container */}
        <div className="max-w-7xl mx-auto px-6 relative ">

        <div 
          className="absolute left-0 right-0 w-full h-[800px] rounded-2xl"
          style={{
            backgroundImage: `url("${bgImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B1239] to-[#1B1239]/90 rounded-2xl"></div>
        </div>
  
        {/* Content container */}
        <div className="container mx-auto relative z-10">
          <div className="relative flex flex-col md:flex-row">
            {/* Vertical line with brain icon */}
            <div className="absolute mt-3 flex w-full flex-row lg:mt-0 lg:h-full lg:w-32 lg:flex-col">
              <div className="my-auto h-1 w-[43%] rounded-none rounded-r-lg bg-gradient-to-b from-white/50 to-white lg:mx-auto lg:h-[43%] lg:w-1 lg:rounded-none lg:rounded-b-lg"></div>
              <Brain className="mx-auto h-[14%] text-3xl text-white drop-shadow-[0_0_10px_#785BFD]" />
              <div className="my-auto h-1 w-[43%] rounded-none rounded-l-lg bg-gradient-to-t from-white/50 to-white lg:mx-auto lg:h-[43%] lg:w-1 lg:rounded-none lg:rounded-t-lg"></div>
            </div>
  
            {/* Main content */}
            <div className="space-y-12 py-12 px-12 xl:py-36 xl:px-48">
              {/* Header */}
              <div className="w-full md:w-5/12">
                <span className="text-lg font-semibold text-[#E7DEFE]">
                  <span className="text-accent-dark">Briefly describe your responsibilities. </span>
                  Our AI will look at your experiences and generate a description that will sell.
                </span>
              </div>
  
              {/* Input/Output Container */}
              <div className="flex w-full flex-col md:flex-row">
                {/* Input Section */}
                <div className="relative w-full py-1 text-base leading-6 sm:text-lg sm:leading-7 md:w-5/12">
                  <div className="rounded-2xl border border-white/50 bg-white/5 backdrop-blur-md">
                    <label className="absolute -top-3 left-3 rounded-md bg-[#2B2249] px-1 leading-none backdrop-blur-md">
                      <span className="text-sm font-light text-white/70">Job Responsibility</span>
                    </label>
                    <div className="flex flex-col items-center justify-center">
                      <input
                        type="text"
                        className="w-full rounded-md bg-transparent p-4 font-semibold text-white focus:border-gray-900 focus:outline-none sm:text-sm"
                        placeholder="I worked on fixing API stuff at google"
                      />
                    </div>
                    <div className="flex items-center gap-4 rounded-b-2xl bg-[#251C40] p-2 leading-tight dark:bg-[#3a2c66]">
                      <Button className="group flex flex-row items-center justify-center gap-2 rounded-full py-3 px-4 font-title font-medium text-white bg-gradient-to-r from-[#6366F1] to-[#9333EA] hover:from-[#869BF8] hover:to-[#9469C0]">
                        Generate
                      </Button>
                      <span className="text-[#C7C9FC]">Let AI re-word your description</span>
                    </div>
                  </div>
                </div>
  
                {/* Arrow */}
                <svg className="mt-12 -ml-2 hidden h-6 w-1/3 fill-white/50 md:block" viewBox="0 0 139 9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M138.383 4.91605C138.579 4.72079 138.579 4.40421 138.383 4.20895L135.201 1.02697C135.006 0.831704 134.69 0.831704 134.494 1.02697C134.299 1.22223 134.299 1.53881 134.494 1.73407L137.323 4.5625L134.494 7.39093C134.299 7.58619 134.299 7.90277 134.494 8.09803C134.69 8.2933 135.006 8.2933 135.201 8.09803L138.383 4.91605ZM0.998596 5.0625H138.03V4.0625H0.998596V5.0625Z" />
                </svg>
  
                {/* Output Section */}
              <div className="relative w-full pt-1 pb-1 text-base leading-6 sm:text-lg sm:leading-7 md:w-2/5">
                  <div className="rounded-2xl border border-white/50 bg-white/5 backdrop-blur-md">
                    <label className="absolute -top-3 left-3 rounded-md bg-[#1B1239] px-1 leading-none backdrop-blur-md">
                      <span className="text-sm font-light text-white/70">Job Responsibility</span>
                    </label>
                    <div className="flex flex-col items-center justify-center">
                      <textarea
                        readOnly
                        className="w-full resize-none rounded-md bg-transparent p-4 font-semibold text-white focus:border-gray-900 focus:outline-none sm:text-sm"
                        value="I developed and implemented solutions to improve the functionality and reliability of Google's API. This resulted in a 30% reduction in system resources"
                      />
                      <div className="flex w-full items-center gap-2 p-4">
                        <Button className="flex items-center gap-3 rounded-md rounded-l-xl border border-yellow-400 bg-yellow-400/20 px-4 py-2 text-white duration-150 hover:bg-yellow-400/40">
                          Retry
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button className="flex items-center gap-3 rounded-md rounded-r-xl bg-emerald-400/60 px-4 py-2 text-white duration-150 hover:bg-emerald-400/80">
                          Accept
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };
  
  export default JobResponsibility;
