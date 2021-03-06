import React, { useCallback, useState, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Image } from "react-native";
import styled from "styled-components/native";
import { Layout, Button, Card, Modal, Text } from "@ui-kitten/components";
import { observer } from "mobx-react";
import useStore from "../../stores";

const Lock = require("../../assets/images/lock.png");

const screen = Dimensions.get("screen");
const containerPadding = 4;
const tilePadding = 1;
const tileWidth = "25%";
const tileHeight = (screen.width - containerPadding * 2 - tilePadding * 2) / 4;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${containerPadding}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;
const OuterStageTile = styled.View`
  padding: 4px;
  height: ${tileHeight}px;
  width: ${tileWidth};
`;

const InnerStageTile = styled.TouchableOpacity`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  text-decoration: none;
  color: #ddd;
  border: none;
  border-radius: 8px;
`;
export const Level = observer(({ navigation, route }) => {
  const { stage } = useStore();
  const { level } = route.params;
  const [visible, setVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const doPlay = useCallback((item) => {
    if (item.isClear) {
      setVisible(true);
      setModalItem({
        level,
        number: item.number,
      });
    } else {
      navigation.push("Play", { level, number: item.number });
    }
  }, []);

  const doReplay = useCallback(() => {
    setVisible(false);
    navigation.push("Play", modalItem);
  }, []);

  useEffect(() => {
    (async () => {
      await stage.getScores(level);
    })();
  }, []);
  return (
    <ScrollView>
      <Layout style={styles.layout}>
        <Container>
          {stage.levels[level].map((item, index) => (
            <OuterStageTile key={index}>
              <InnerStageTile
                onPress={() => doPlay(item)}
                style={{
                  backgroundColor: item.isClear ? "#5f61bb" : "#424392",
                }}
              >
                {item.isClear ? (
                  <>
                    <Text style={styles.text}>{item.number}</Text>
                    <Text>CLEAR</Text>
                  </>
                ) : (
                  <>
                    <Text>{item.number}</Text>
                    <Image source={Lock} style={{ width: 40, height: 40 }} />
                  </>
                )}
              </InnerStageTile>
            </OuterStageTile>
          ))}
        </Container>

        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true}>
            <Text>You have already cleared it.</Text>
            <Text style={{ marginBottom: 20 }}>
              Would you like to try again?
            </Text>
            <Button onPress={() => doReplay()}>Go</Button>
          </Card>
        </Modal>
      </Layout>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  layout: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#1F204C",
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
  },
  isCorrect: {
    color: "#2ecc71",
  },
});
