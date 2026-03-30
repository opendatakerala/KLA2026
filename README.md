# KLA Election 2026
This is a community initiative to explore the 2026 Kerala Legislative Assembly Election through data. The data is sourced from various media outlets, social media handles of political parties, the Chief Electoral Officer Kerala website, gazette notifications, Wikipedia, Wikidata and OpenStreetMap.

Cite our work 
> Kerala legislative assembly election 2026 ODK portal. 1.0.0, OpenDataKerala Community, 29 Mar. 2026, https://doi.org/10.5281/zenodo.19323427.

* Website under GPL-3.0 license  
* Candidate Dataset - 2026 Kerala Assembly Elections: Candidate Registry (Demographics & Alliances) [Data set - ODbL license]. OpenDataKerala Community. https://doi.org/10.5281/zenodo.19323710
* Concept Paper - (Coming Soon)

# About the Portal
The platform integrates data from multiple sources to provide a comprehensive and accessible public dataset, along with references to past election information. 

Our initiative aims to collect, curate, and present comprehensive election-related data with meaningful public-interest analysis, insights, and interpretations. We strive to make election data accessible, understandable, and useful for everyone. The primary objective is to ensure that reliable and structured information is available to a wide range of users, including the general public, political workers, researchers, and journalists.

The OpenDataKerala Election Data Portal represents a collaborative effort to democratize election data by promoting transparency, enabling research, and supporting informed public participation. By integrating technology with community-driven efforts and open data principles, the project contributes significantly to strengthening the digital public infrastructure surrounding elections.

The platform offers a range of features designed to enhance usability and deliver deeper insights. It provides general statistics on the 2026 Kerala Legislative Assembly Election, alongside analyses of party distribution and voter demographics like gender and age. Users can easily navigate and analyze specific data segments using custom filters for category, political party, and district.

For better accessibility, the portal features both table and map-based views. The table view provides detailed information through structured cards, with a dedicated card for each of the 140 legislative assembly constituencies. Each card includes the district, constituency number and name, number of polling booths, and voter demographics based on gender. It also provides key details on the contesting candidates, including their names, political parties, and alliances.

In addition, the platform provides historical election data for comparative analysis. This includes Kerala Legislative Assembly (Niyamasabha) election results for the years 2011, 2016, and 2021, presented through bar charts, stacked visualizations, and tabular formats. Lok Sabha election results are also included as reference data, similarly visualized using multiple formats to support deeper analysis.

To complement the tabular view, an interactive map allows users to explore the datasets geographically. By combining this spatial visualization with custom filtering and historical context, the platform empowers users to uncover deeper insights into electoral trends and patterns.

# Team
## Core Team
1. Manoj Karingamadathil – Project Management & Data Modeling
2. Akshay S Dinesh – Web Technology & Informatics
3. Navaneeth T M – Infography & Data Curation
4. Athul R T – Data Scraping & Management
5. Haniyah Olassery Usman – Data Curation, Analytics & Media Outreach
6. Sruthi Mohandas – (Intern, Sahya Digital Conservation Foundation)
7. Jameela P – Infographics & Icons
8. Rajaneesh P – Map
9. Arun Raj K M - Data

## Supporting Team
OpenDataKerala (ODK) Election Data Working Group - Jinoy Tom Jacob, Naveen Francis, Ark Arjun, Jothish Babu, Jaisen Nedumpala, Ranjith Sajeev

## OpenData for Journalism Workshop at Calicut University
This project also acknowledges the contributions of 19 participants from a collaborative workshop at Department Of Journalism And Mass Communication, University of Calicut as part of **Open Data Day 2026** supported by Wikimedians of Kerala User Group and Sahya Digital Conservation Foundation.

Workshop Participants:-
Manjusha P M, Athira M P, Noufal K K, Ayisha Raha E, Riza Raz, Muhammed Sahad M, Abhinand C P, Revathy Mahendran, Aruniga Babu, Safa Parvin, Afiya P A, Vishnu K, Rinsha M K, Haniyah Ollassery Usman, Navaneeth T M, Abhishek V T, Dr. Muhammadali N, Dr. Abdul Muneer V, Dr. Ashraf P

# Technology 
The platform has evolved rapidly from a single HTML proof-of-concept to a full-fledged web platform powered by Svelte (for interactive frontend), d3 and Apache ECharts (for interactive graphs), Astro (for build), Github Pages (for frontend deployment), a bespoke NodeJS API (for backend) and a linked dataset as database. Details of the libraries used can be found in [package.json](https://github.com/opendatakerala/KLA2026/blob/main/package.json).
