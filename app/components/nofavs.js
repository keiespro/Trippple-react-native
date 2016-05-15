
//
// class NoFavorites extends Component{
//
//   render(){
//     return (
//
//       <ScrollView
//         contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
//         scrollEnabled={false}
//         centerContent={true}
//         style={{
//         backgroundColor:colors.outerSpace,
//         flex:1,
//         alignSelf:'stretch',
//         width:DeviceWidth}}
//         >
//         <FadeInContainer>
//
//           <View
//             style={{
//               flexDirection:'column',
//               padding:20,
//               justifyContent:'space-between',
//               alignItems:'center',
//               alignSelf:'stretch',
//               paddingBottom:80,
//             }}
//             >
//
//             <Image
//               style={{
//                 width:175,
//                 height: MagicNumbers.is4s ? 150 : 180,
//                 marginBottom: MagicNumbers.is4s ? 20 : 40
//               }}
//               source={{uri: 'assets/iconPlaceholderFavs@3x.png'}}
//               resizeMode={Image.resizeMode.contain}
//             />
//
//             <Text
//               style={{
//                 color:colors.white,
//                 fontSize:MagicNumbers.is4s ? 18 : 22,
//                 fontFamily:'Montserrat-Bold',
//                 textAlign:'center',
//                 marginBottom:20
//               }}
//               >{
//                 `YOUR FAVORITE PEOPLE`
//               }
//             </Text>
//             <Text
//               style={{
//                 color:colors.shuttleGray,
//                 fontSize: MagicNumbers.is4s ? 16 : 20,
//                 fontFamily:'omnes',
//                 textAlign:'center'
//               }}
//               >{
//                 `Swipe left to add a match to your favorites for easy access`
//               }
//             </Text>
//
//           </View>
//         </FadeInContainer>
//
//       </ScrollView>
//     )
//   }
// }
