import { Hero } from "./Hero";
import { VideoGallery } from "./VideoGallery";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#0f1d26] to-[#1a2d3a]">
      <Hero />
      
      {/* Section 1: Reaction Identity */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Reaction Masters</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Where <span className="text-red-500">Laughter</span> Meets Reaction
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              AleTube isn't just reactions - it's a cultural phenomenon bringing the funniest Ethiopian reactions to global trends.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-red-500/70 transition-all">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <div className="text-red-500 text-2xl">🤣</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Meme Reactions</h3>
              <p className="text-gray-400">
                Our hilarious takes on the internet's funniest memes that leave you in stitches.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-red-500/70 transition-all">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <div className="text-red-500 text-2xl">🔥</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Viral Videos</h3>
              <p className="text-gray-400">
                Reacting to the hottest global trends with authentic Ethiopian flavor.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-red-500/70 transition-all">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <div className="text-red-500 text-2xl">🇪🇹</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Local Flavor</h3>
              <p className="text-gray-400">
                Ethiopian reactions to local trends that have us crying with laughter.
              </p>
            </div>
          </div>
          
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>
      
      {/* Section 2: The Reactors */}
      <section className="py-20 px-4 relative bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Meet The Reactors</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Faces Behind the <span className="text-red-500">Reactions</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Alex", image: "/personalities/Alex.png" },
              { name: "Sara", image: "/personalities/Sara.png" },
              { name: "Dawit", image: "/personalities/Dawit.png" },
              { name: "Betty", image: "/personalities/Betty.png" }
            ].map((person, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-6 h-80">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  
                  {/* Personality Image */}
                  <Image 
                    src={person.image}
                    alt={person.name}
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                  
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-xl font-bold text-white">{person.name}</h3>
                    <p className="text-red-400">Reaction Specialist</p>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {index+1}00K Followers
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 group-hover:text-red-400 transition-colors">
                  Known for priceless reactions to Ethiopian memes and viral videos.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Section 3: Reaction Impact */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-red-500/10 px-4 py-2 rounded-full mb-6">
                <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Reaction Impact</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Laughter <span className="text-red-500">By The Numbers</span>
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl">
                Our reactions have created a community that spans across Ethiopia and the diaspora.
              </p>
              <div className="flex gap-4">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all">
                  Join Community
                </button>
                <button className="border border-red-500 text-red-500 hover:bg-red-500/10 font-bold py-3 px-6 rounded-full transition-all">
                  Submit Memes
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-5xl font-bold text-red-400 mb-4">1M+</div>
                <h3 className="text-xl font-bold text-white mb-2">Monthly Views</h3>
                <p className="text-gray-400">Of hilarious reactions</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-5xl font-bold text-red-400 mb-4">500+</div>
                <h3 className="text-xl font-bold text-white mb-2">Reactions</h3>
                <p className="text-gray-400">To memes & viral videos</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-5xl font-bold text-red-400 mb-4">10K+</div>
                <h3 className="text-xl font-bold text-white mb-2">Memes Submitted</h3>
                <p className="text-gray-400">By our awesome community</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-5xl font-bold text-red-400 mb-4">4</div>
                <h3 className="text-xl font-bold text-white mb-2">Reaction Experts</h3>
                <p className="text-gray-400">Bringing the laughs daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 4: Meme Reactions */}
      <section className="py-20 px-4 relative bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Meme Reactions</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              This Week's <span className="text-red-500">Funniest Reactions</span>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              See our team lose it to the internet's hottest memes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="relative overflow-hidden rounded-3xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                New
              </div>
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-bold text-white">Animal Memes</h3>
                <p className="text-red-400">Alex couldn't stop laughing</p>
              </div>
              <Image 
                src="/memes/animal-memes.jpg"
                alt="Animal memes"
                layout="fill"
                objectFit="cover"
              />
            </div>
            
            <div className="relative overflow-hidden rounded-3xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                Viral
              </div>
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-bold text-white">TikTok Fails</h3>
                <p className="text-red-400">Sara's priceless reactions</p>
              </div>
              <Image 
                src="/memes/tiktok-fails.jpg"
                alt="TikTok fails"
                layout="fill"
                objectFit="cover"
              />
            </div>
            
            <div className="relative overflow-hidden rounded-3xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                Trending
              </div>
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-bold text-white">Ethiopian Memes</h3>
                <p className="text-red-400">The whole team couldn't breathe</p>
              </div>
              <Image 
                src="/memes/ethiopian-memes.jpg"
                alt="Ethiopian memes"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          
          <div className="text-center mt-16">
            <button className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500/10 font-bold py-4 px-8 rounded-full text-lg transition-all">
              View All Reactions
            </button>
          </div>
        </div>
      </section>
      
      {/* Section 5: Meme Submission */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-slate-800 px-4 py-2 rounded-full mb-4 border border-red-500/30">
            <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Submit Memes</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Got a <span className="text-red-500">Funny Meme?</span>
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
            Send us your funniest memes and we might react to them in our next video!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Your meme link or description" 
              className="flex-1 bg-slate-800 border border-red-500/30 rounded-full py-4 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 px-8 rounded-full transition-all">
              Submit Meme
            </button>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-72 bg-red-500/10 rounded-full blur-[100px]"></div>
      </section>
      
      <VideoGallery />
    </div>
  );
}