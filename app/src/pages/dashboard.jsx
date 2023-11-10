import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useEffect, useState } from "react";
import { Button } from "src/components/Button";
import { PostForm } from "src/components/PostForm";
import { useBlog } from "src/context/Blog";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import * as Web3 from "@solana/web3.js";
import { useCallback } from "react";

export const Dashboard = () => {
  const [connecting, setConnecting] = useState(false);
  const { connected, select, disconnect, publicKey } = useWallet();
  const {
    user,
    posts,
    initialized,
    initUser,
    createPost,
    showModal,
    setShowModal,
  } = useBlog();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [balance, setBalance] = useState(0);

  const onConnect = () => {
    setConnecting(true);
    select(PhantomWalletName);
  };

  const handleDisconnect = () => {
    localStorage.removeItem("connectedWallet");
    disconnect();
  };

  const checkBalance = useCallback(async () => {
    if (publicKey) {
      // Create a new connection object
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      // Use the connection object to get the balance
      const balance = await connection.getBalance(publicKey);
      // Solana's balance is in lamports, convert it to SOL
      const solBalance = balance / Web3.LAMPORTS_PER_SOL;
      setBalance(solBalance);
    }
  }, [publicKey]);

  useEffect(() => {
    if (user) {
      setConnecting(false);
    }
  }, [user]);

  // Call checkBalance whenever the public key changes
  useEffect(() => {
    checkBalance();
  }, [publicKey, checkBalance]);

  return (
    <div className="bg-black overflow-auto h-screen">
      <header className="fixed z-10 w-full h-14 shadow-md bg-black">
        <div className="flex justify-between items-center h-full px-4 pr-10">
          {/* Left side (potentially empty if you want the avatar on the extreme right) */}
          <div></div>

          {/* Right side */}
          <div className="flex items-center">
            {connected && user ? (
              <>
                {initialized ? (
                  <Button
                    className="ml-3 mr-2"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Create Quote
                  </Button>
                ) : (
                  <Button
                    className="ml-3 mr-2"
                    onClick={() => {
                      initUser();
                    }}
                  >
                    Initialize User
                  </Button>
                )}
                <p className="font-bold text-sm ml-2 capitalize">
                  {user?.name}
                </p>
                <img
                  src={user?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full bg-gray-800 shadow ring-2 ring-indigo-800 ring-offset-2 ring-opacity-50 ml-2"
                />
              </>
            ) : (
              <Button
                loading={connecting}
                className="w-28"
                onClick={onConnect}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                }
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-main pb-4 container flex relative">
        <div className="pt-3">
          <h1 className="title">Sol Quotes</h1>

          {connected ? (
            <div className="all__posts-container">
              <div className="flex flex-col space-y-4 mr-10">
                {" "}
                {/* This ensures vertical stacking with some space between each post */}
                {posts.map((item) => {
                  return (
                    <article
                      className="post__card-2 w-full rounded-md border mb-4" // Adjusted classes here
                      onClick={() => {
                        // handle click
                      }}
                      key={item.account.id}
                    >
                      <div className="post__card_-2 p-6">
                        {" "}
                        {/* Added padding */}
                        <blockquote className="mt-6 border-l-4 pl-4 italic text-3xl">
                          {`"${item.account.content}"`}
                        </blockquote>
                        <p className="-mt-2 pl-4 pt-10">
                          - {item.account.title}
                        </p>{" "}
                        {/* Adjusted classes here */}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        {connected ? (
          <aside className="items-center lg:w-full h-screen sticky top-0 ml-10">
            <div className="flex flex-col space-y-4">
              <div className="mt-10">
                <h1 className="font-bold text-4xl">User Details</h1>
              </div>
              <div>
                <h2 className="font-semibold text-lg ">Public Key:</h2>
              </div>
              <div>
                <h3 className="">{publicKey.toBase58()}</h3>
              </div>
              <div>
                <h2 className="font-semibold text-lg ">Balance:</h2>
              </div>
              <div>
                <h3 className="">{balance} Sol</h3>
              </div>
            </div>
            <div className="mt-10 w-full items-center">
              <Button
                // variant="link"
                className="w-full"
                onClick={() => {
                  window.open(
                    `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
                    "_blank"
                  );
                }}
              >
                View Transaction History
              </Button>
            </div>
            <div className="mt-5 w-full">
              <Button
                // variant="default"
                className="w-full bg-black border-pink-500"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </Button>
            </div>
          </aside>
        ) : null}
        <div className={`modal ${showModal && "show-modal"}`}>
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>
              ×
            </span>
            <PostForm
              postTitle={postTitle}
              postContent={postContent}
              setPostTitle={setPostTitle}
              setPostContent={setPostContent}
              onSubmit={() => createPost(postTitle, postContent)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
