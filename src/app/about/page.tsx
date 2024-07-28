import Link from "next/link";
import { Intro } from "../_components/intro";
import Container from "@/app/_components/container";
import Footer from "../_components/footer";
import { PiFlowerLotusThin } from "react-icons/pi";
import {FaComputer} from "react-icons/fa6"
import { IconContext } from "react-icons";

export default function About() {
    return(
        <Container>
            <Intro />
                <section className="body-font">
                <div className="lg:w-4/6 mx-auto">
                    <div className="flex flex-col sm:flex-row mt-10">
                        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                            <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 ">
                                <PiFlowerLotusThin />
                            </div>
                            <div className="flex flex-col items-center text-center justify-center">
                                <h2 className="font-medium title-font mt-4  text-lg">About me</h2>
                                <div className="w-12 h-1 bg-pink-500 rounded mt-2 mb-4"></div>
                            </div>
                        </div>
                        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                        <p className="leading-relaxed text-lg mb-4">
                            こんにちは。「ノハナ カマツケ」と申します。<br />
                            フロントエンドエンジニアになるべく只今研修中です。<br />
                            <br />
                            想像力を働かせながら０から作り上げること、実際に出来たものを動かす瞬間が好きです。<br />
                            <br />
                            旅行が大好きです。今まで訪れた場所はタイ、ベトナム、インドネシア、アメリカ、オーストラリアです。<br />
                        </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="body-font">
                <div className="lg:w-4/6 mx-auto">
                    <div className="flex flex-col sm:flex-row mt-10">
                        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                            <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 ">
                                    <FaComputer />
                            </div>
                            <div className="flex flex-col items-center text-center justify-center">
                                <h2 className="font-medium title-font mt-4 text-lg">Skill</h2>
                                <div className="w-12 h-1 bg-pink-500 rounded mt-2 mb-4"></div>
                            </div>
                        </div>
                        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                        <p className="leading-relaxed text-lg mb-4">
                            Backend  : Ruby, PostgreSQL<br />
                            Frontend : React, TypeScript, Next.js<br />
                        </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </Container>
    );
}